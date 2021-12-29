#!/bin/python3
"""
Special String Again

A string is said to be a special string if either of two conditions is met:

    All of the characters are the same, e.g. aaa.
    All characters except the middle one are the same, e.g. aadaa.

A special substring is any substring of a string which meets one of those criteria. Given a string, determine how many special substrings can be formed from it. 

https://www.hackerrank.com/challenges/special-palindrome-again/problem
"""

import math
import os
import random
import re
import sys

# Complete the substrCount function below.
def substrCount(n, s):
    slen = len(s)
    
    def isspecial(l, r):
        c = s[l]
        cnt = 0
        while l >=0 and r < slen and s[l] == s[r] and s[l] == c:
            cnt += 1
            # print(s[l:r+1])
            l -= 1
            r += 1            
        return cnt
            
    
    specials = 0
    for i in range(slen):
        specials += 1
        specials += isspecial(i, i+1)
        specials += isspecial(i-1, i+1)
    return specials
    
    

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    n = int(input())

    s = input()

    result = substrCount(n, s)

    fptr.write(str(result) + '\n')

    fptr.close()
