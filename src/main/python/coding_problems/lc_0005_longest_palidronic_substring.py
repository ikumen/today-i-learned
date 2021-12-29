"""
Given a string s, return the longest palindromic substring in s.

 

Example 1:

Input: s = "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Example 2:

Input: s = "cbbd"
Output: "bb"

Example 3:

Input: s = "a"
Output: "a"

Example 4:

Input: s = "ac"
Output: "a"
"""
class SolutionBruteForce:
    def longestPalindrome(self, s):
        """
        Brute force:
            - iterate through every position and O(n)
                - make substring by expanding right, until end O(n)
                - test each substring if palidrome  O(n)

        runtime: O(n^3)
        space: O(1)
        """
        def is_palindrome(start, end):
            while end > start:
                if s[start] != s[end]:
                    return False
                end -= 1
                start += 1
            return True

        p_start = 0
        p_len = 0 
        s_len = len(s)

        for i in range(s_len):
            k = i
            while k < s_len:
                if is_palindrome(i, k) and p_len < (k-i):
                    p_start = i
                    p_len = k - i + 1
                k += 1
        return s[p_start:p_start + p_len]



class Solution:
    def longestPalindrome(self, s):
        """
        Key insight: brute force solution built substring by expanding left->right
            - instead we can expand from a mid point, for every position, expand
                in both left/right directions
            - this allows us to just do 1 iteration

        runtime: O(n^2)
        space: O(1)
        """
        def expand_to_palindrome(left, right):
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return left+1, right-left-1
            
        p_start = 0
        p_len = 0
        s_len = len(s)

        for i in range(s_len):
            e_start, e_len = expand_to_palindrome(i, i+1)
            o_start, o_len = expand_to_palindrome(i-1, i+1)

            if p_len < e_len or p_len < o_len:
                if e_len > o_len:
                    p_start = e_start
                    p_len = e_len
                else:
                    p_start = o_start
                    p_len = o_len
        
        return s[p_start:p_start + p_len]


# sol = SolutionBruteForce()
# print(sol.longestPalindrome("aaabbbb"))

sol = Solution()
# print(sol.longestPalindrome("uwqrvqslistiezghcxaocjbhtktayupazvowjrgexqobeymperyxtfkchujjkeefmdngfabycqzlslocjqipkszmihaarekosdkwvsirzxpauzqgnftcuflzyqwftwdeizwjhloqwkhevfovqwyvwcrosexhflkcudycvuelvvqlbzxoajisqgwgzhioomucfmkmyaqufqggimzpvggdohgxheielsqucemxrkmmagozxhvxlwvtbbcegkvvdrgkqszgajebbobxnossfrafglxvryhvyfcibfkgpbsorqprfujfgbmbctsenvbzcvypcjubsnjrjvyznbswqawodghmigdwgijfytxbgpxreyevuprpztmjejkaqyhppchuuytkdsteroptkouuvmkvejfunmawyuezxvxlrjulzdikvhgxajohpzrshrnngesarimyopgqydcmsaciegqlpqnclpwcjqmhtmtwwtbkmtnntdllqbyyhfxsjyhugnjbebtxeljytoxvqvrxygmtogndrhlcmbmgiueliyfkkcuypvvzkomjrfhuhhnfbxeuvssvvllgukdolffukzwqaimxkngnjnmsbvwkajyxqntsqjkjqvwxnlxwjfiaofejtjcveqstqhdzgqistxwsgrovvwgorjaoosremqbzllgbgrwtqdggxnyvkivlcvnv"))
print(sol.longestPalindrome("vv"))

