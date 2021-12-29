"""
You are given a list of strings dictionary and two strings start and end. You want to reach from start to end by modifying one character at a time and making sure each resulting word is also in the dictionary. Words are case-sensitive.

Return the minimum number of steps it would take to reach end. Return -1 if it's not possible.

Constraints

    0 ≤ n * m ≤ 300,000 where n is the length of dictionary and m is the length of the longest string

https://binarysearch.com/problems/Dictionary-Nomad
"""
from collections import deque

class Solution:
    def solve(self, dictionary, start, end):
        a = ord('a') # 65
        A = ord('A') # 97
        def enqueue(curr, words, queue):
            for i, c in enumerate(curr):
                for k in range(26):
                    prefix, suffix = curr[:i], curr[i+1:]
                    word = (prefix + chr(a+k) + suffix)
                    if word in words:
                        words.remove(word)
                        queue.append(word)
                        continue

        words = set(dictionary)
        steps, queue = 1, deque([start])
        while queue:
            size = len(queue)
            while size:
                currword = queue.popleft()
                if currword == end:
                    return steps
                enqueue(currword, words, queue)
                size -= 1
            steps += 1
        return -1