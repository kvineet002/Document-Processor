from django.shortcuts import render
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentUploadSerializer,DocumentSerializer
from .utils.rag import process_document, answer_question

@api_view(['GET'])
def list_documents(request):
    documents = Document.objects.all()
    serializer = DocumentSerializer(documents, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def upload_document(request):
    serializer = DocumentUploadSerializer(data=request.data)
    if serializer.is_valid():
        document = serializer.save()
        process_document(document.id, document.content)
        return Response({"message": "Document uploaded and processed", "doc_id": document.id})
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def ask_question(request):
    doc_id = request.data.get("document_id")
    question = request.data.get("question")
    top_k = request.data.get("top_k", 3)
    answer = answer_question(doc_id, question, top_k)
    return Response({"answer": answer})
