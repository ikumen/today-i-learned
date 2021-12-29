"""
Given a string s of words delimited by spaces, reverse the order of words.

Constraints

    n ≤ 100,000 where n is the length of s


https://binarysearch.com/problems/Reverse-Words
"""
class Solution:
    def solve(self, sentence):
        words = sentence.split(' ')
        mid = len(words) // 2
        i = 0
        while i < mid:
            tmp = words[i]
            words[i] = words[-(i+1)]
            words[-(i+1)] = tmp
            i += 1
        return " ".join(words)