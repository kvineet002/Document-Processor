from django.urls import path
from .views import list_documents, upload_document, ask_question

urlpatterns = [
    path('documents/', list_documents),
    path('documents/upload/', upload_document),
    path('documents/ask/', ask_question),
]
