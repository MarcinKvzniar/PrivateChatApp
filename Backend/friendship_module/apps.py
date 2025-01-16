from django.apps import AppConfig


class FriendshipModuleConfig(AppConfig):
    """
    Configuration class for the friendship application.
    This class is used to configure the settings for the friendship application.
    Attributes:
        default_auto_field (str): Specifies the type of auto-incrementing primary key field to use.
        name (str): The name of the application.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'friendship_module'

    def ready(self):
        import friendship_module.signals