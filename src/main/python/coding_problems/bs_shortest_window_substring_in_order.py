"""
Shortest Window Substring in Order
Hard

Given a lowercase alphabet string s, return the length of the shortest substring containing all alphabet characters in order from "a" to "z". If there's no solution, return -1.

Constraints

0 ≤ n ≤ 100,000 where n is the length of s

https://binarysearch.com/problems/Shortest-Window-Substring-in-Order
"""
class Solution:
    def solve(self, s):
        slen = len(s)
        if slen < 26:
            return -1

        @lru_cache(None)
        def is_remaining(i, l):
            if slen-i < 26-l:
                # print("not long enough")
                return -1
            next_letter = chr(l+97)
            if s[i] != next_letter:
                return is_remaining(i+1, l)
            else:
                if next_letter != 'z':
                    return is_remaining(i+1, l+1)
                return i
            return -1

        i = 0
        alen = slen + 1
        while i < slen:
            k = is_remaining(i, 0)
            if k != -1:
                alen = min(alen, k-i+1)
            i += 1

        if alen == slen + 1:
            return -1
        return alen

                            