import ollama

from typing import List


class OllamaChat:

    def __init__(self, model_name: str):
        self.model_name = model_name

    def get_response(self, messages: List):
        response = ollama.chat(
            model=self.model_name,
            messages=messages,
            tools=None,
        )

        return response.message.role, response.message.content
