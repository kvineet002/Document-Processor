from .chunker import chunk_text
from .embeddings import get_embedding
from .vectorstore import add_to_vectorstore, search_similar
import openai
from ..models import DocumentChunk

def process_document(document_id, text):
    try:
        chunks = chunk_text(text)
        print("Working on document:", document_id)

        for idx, chunk in enumerate(chunks):
            emb = get_embedding(chunk)
            emb_id = f"{document_id}_{idx}"

            DocumentChunk.objects.create(
                document_id=document_id,
                chunk_index=idx,
                page_number=None,
                text=chunk,
                embedding_id=emb_id
            )

            add_to_vectorstore(document_id, [chunk], [emb])
            print(f"Processed chunk {idx + 1}/{len(chunks)}")

    except Exception as e:
        print("[ERROR]", e)

import requests
import json

def answer_question(document_id, question, top_k=3):
    question_embedding = get_embedding(question)
    results = search_similar(question_embedding,document_id, top_k)
    context_chunks = results["documents"][0]
    context = "\n\n".join(context_chunks)

    # Combine system instructions with the user question
    user_message = (
        "You are a helpful assistant.\n\n"
        f"Use the following context to answer:\n\n{context}\n\nQuestion: {question}"
    )

    payload = {
        "model": "mistralai/mistral-7b-instruct-v0.3",
        "messages": [
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "stream": False,
        "max_tokens": 1024
    }

    try:
        response = requests.post(
            "http://127.0.0.1:1234/v1/chat/completions",
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.HTTPError as e:
        print("❌ HTTP Error:", e.response.status_code, e.response.text)
        return "Failed to get response."
    except Exception as e:
        print("❌ General Error:", str(e))
        return "Something went wrong."
