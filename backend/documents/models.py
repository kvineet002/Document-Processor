from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=50)
    file_size = models.PositiveIntegerField()
    num_pages = models.PositiveIntegerField()
    content= models.TextField(null=True, blank=True) 
    processing_status = models.CharField(max_length=50, choices=[
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("done", "Done"),
        ("error", "Error")
    ], default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.PositiveIntegerField()
    page_number = models.PositiveIntegerField(null=True, blank=True)
    text = models.TextField()
    embedding_id = models.CharField(max_length=255, null=True, blank=True)  # ID from vector DB
