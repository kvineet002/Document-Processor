import faiss
import numpy as np


EMBEDDING_DIM = 384

# FAISS index and lookup maps
faiss_index = faiss.IndexFlatL2(EMBEDDING_DIM)
doc_id_map = {}  # Maps index -> (document_id, chunk_text)
vector_count = 0

def add_to_vectorstore(document_id, chunks, embeddings):
    global vector_count

    try:
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            print(f"\n[FAISS] Adding chunk {i + 1}/{len(chunks)} for document {document_id}")
            print(f"  - Chunk preview: {chunk[:100]}...")
            print(f"  - Embedding type: {type(emb)}, length: {len(emb)}")

            # Convert to float32 numpy array
            if isinstance(emb, list):
                emb = np.array(emb, dtype=np.float32)
            elif isinstance(emb, np.ndarray):
                emb = emb.astype(np.float32)
            else:
                raise ValueError("Embedding must be list or ndarray")

            # Reshape to (1, 384) for FAISS
            emb = emb.reshape(1, -1)
            faiss_index.add(emb)
            doc_id_map[vector_count] = {
                "document_id": document_id,
                "chunk_index": i,
                "text": chunk
            }
            print("  - Chunk added to FAISS.")
            vector_count += 1

    except Exception as e:
        print("[ERROR] Failed to add to FAISS vectorstore:", e)
        raise e


def search_similar(query_embedding, document_id, top_k=3):
    if isinstance(query_embedding, list):
        query_embedding = np.array(query_embedding, dtype=np.float32)
    elif isinstance(query_embedding, np.ndarray):
        query_embedding = query_embedding.astype(np.float32)
    else:
        raise ValueError("Query embedding must be list or ndarray")

    query_embedding = query_embedding.reshape(1, -1)

    # Perform search
    D, I = faiss_index.search(query_embedding, top_k * 5)

    filtered_docs = []
    for idx in I[0]:
        if idx == -1:
            continue
        entry = doc_id_map.get(idx)
        if entry and entry['document_id'] == document_id:
            filtered_docs.append(entry['text'])
            if len(filtered_docs) == top_k:
                break

    return {"documents": [filtered_docs]}
