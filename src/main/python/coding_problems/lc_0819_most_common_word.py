class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        """
        key insight:
            - make banned a hash lookup
            - build another hash of all words not in banned
            - keep track of occurrences in all words hash
        """
        most_word = None
        most_cnt = 0
        words = {}
        banned = set(banned)
        n = len(paragraph)
        i = 0
        while i < n:
            k = i
            while k < n and paragraph[k].isalpha():
                k += 1
            if k > i:
                word = paragraph[i:k].lower()
                if word not in banned:
                    words[word] = words.get(word, 0) + 1
                    if most_cnt < words[word]:
                        most_cnt = words[word]
                        most_word = word
                i = k
            else:
                i += 1
        return most_word
    