from django.apps import AppConfig


class FriendshipModuleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'friendship_module'

    def ready(self):
        import friendship_module.signals