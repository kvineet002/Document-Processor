import pdfplumber
from rest_framework import serializers
from .models import Document, DocumentChunk
import os
from django.core.files.storage import default_storage

class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        uploaded_file = validated_data['file']
        filename = uploaded_file.name
        title = filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
        file_type = filename.rsplit('.', 1)[-1].lower()
        file_size = uploaded_file.size

        # Save file to temporary location to process
        temp_path = default_storage.save(f"uploads/{filename}", uploaded_file)

        full_path = default_storage.path(temp_path)

        content_chunks = ""
        num_pages = 0

        if file_type == "pdf":
            with pdfplumber.open(full_path) as pdf:
                num_pages = len(pdf.pages)
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    content_chunks+= text  # Split by paragraphs
                    
        else:
            raise serializers.ValidationError("Only PDF files are supported for now.")

        # Save Document
        document = Document.objects.create(
            title=title,
            file_path=temp_path,
            file_type=file_type,
            file_size=file_size,
            num_pages=num_pages,
            content=content_chunks,
            processing_status="done"
        )


        return document
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'