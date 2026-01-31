from enum import Enum


class MESSAGES(str, Enum):
    DEFAULT = lambda msg="": f"{msg if msg else ''}"
    MODEL_ADDED = lambda model="": f"The model '{model}' has been added successfully."
    MODEL_DELETED = (
        lambda model="": f"The model '{model}' has been deleted successfully."
    )


class WEBHOOK_MESSAGES(str, Enum):
    DEFAULT = lambda msg="": f"{msg if msg else ''}"
    USER_SIGNUP = lambda username="": (
        f"New user signed up: {username}" if username else "New user signed up"
    )


class ERROR_MESSAGES(str, Enum):
    def __str__(self) -> str:
        return super().__str__()

    DEFAULT = (
        lambda err="": f'{"Something went wrong :/" if err == "" else "[ERROR: " + str(err) + "]"}'
    )
    ENV_VAR_NOT_FOUND = "Required environment variable not found. Terminating now."

    ID_TAKEN = "Uh-oh! This id is already registered. Please choose another id string."

    UNAUTHORIZED = "401 Unauthorized"
    ACCESS_PROHIBITED = "You do not have permission to access this resource. Please contact your administrator for assistance."
    ACTION_PROHIBITED = (
        "The requested action has been restricted as a security measure."
    )

    FILE_NOT_SENT = "FILE_NOT_SENT"
    FILE_NOT_SUPPORTED = "Oops! It seems like the file format you're trying to upload is not supported. Please upload a file with a supported format and try again."

    NOT_FOUND = "We could not find what you're looking for :/"
    USER_NOT_FOUND = "We could not find what you're looking for :/"
    API_KEY_NOT_FOUND = "Oops! It looks like there's a hiccup. The API key is missing. Please make sure to provide a valid API key to access this feature."
    API_KEY_NOT_ALLOWED = "Use of API key is not enabled in the environment."

    MALICIOUS = "Unusual activities detected, please try again in a few minutes."

    PANDOC_NOT_INSTALLED = "Pandoc is not installed on the server. Please contact your administrator for assistance."
    INCORRECT_FORMAT = (
        lambda err="": f"Invalid format. Please use the correct format{err}"
    )
    RATE_LIMIT_EXCEEDED = "API rate limit exceeded"

    MODEL_NOT_FOUND = lambda name="": f"Model '{name}' was not found"
    OPENAI_NOT_FOUND = lambda name="": "OpenAI API was not found"
    OLLAMA_NOT_FOUND = "WebUI could not connect to Ollama"
    CREATE_API_KEY_ERROR = "Oops! Something went wrong while creating your API key. Please try again later. If the issue persists, contact support for assistance."
    API_KEY_CREATION_NOT_ALLOWED = "API key creation is not allowed in the environment."

    EMPTY_CONTENT = "The content provided is empty. Please ensure that there is text or data present before proceeding."

    DB_NOT_SQLITE = "This feature is only available when running with SQLite databases."

    INVALID_URL = (
        "Oops! The URL you provided is invalid. Please double-check and try again."
    )

    WEB_SEARCH_ERROR = (
        lambda err="": f"{err if err else 'Oops! Something went wrong while searching the web.'}"
    )

    OLLAMA_API_DISABLED = (
        "The Ollama API is disabled. Please enable it to use this feature."
    )

    FILE_TOO_LARGE = (
        lambda size="": f"Oops! The file you're trying to upload is too large. Please upload a file that is less than {size}."
    )

    DUPLICATE_CONTENT = (
        "Duplicate content detected. Please provide unique content to proceed."
    )
    FILE_NOT_PROCESSED = "Extracted content is not available for this file. Please ensure that the file is processed before proceeding."


class TASKS(str, Enum):
    def __str__(self) -> str:
        return super().__str__()

    DEFAULT = lambda task="": f"{task if task else 'generation'}"
    TITLE_GENERATION = "title_generation"
    TAGS_GENERATION = "tags_generation"
    EMOJI_GENERATION = "emoji_generation"
    QUERY_GENERATION = "query_generation"
    IMAGE_PROMPT_GENERATION = "image_prompt_generation"
    AUTOCOMPLETE_GENERATION = "autocomplete_generation"
    FUNCTION_CALLING = "function_calling"
    MOA_RESPONSE_GENERATION = "moa_response_generation"
