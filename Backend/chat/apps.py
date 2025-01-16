from django.apps import AppConfig

class ChatConfig(AppConfig):
    """
    Configuration class for the chat application.
    This class is used to configure the settings for the chat application.
    Attributes:
        default_auto_field (str): Specifies the type of auto-incrementing primary key field to use.
        name (str): The name of the application.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'
