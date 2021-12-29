"""
Given a non-negative integer num, convert it to an English number word as a string. num will be less than one trillion.

Constraints

    0 ≤ num < 10 ** 12


https://binarysearch.com/problems/Integer-to-English
"""
class Solution:

    def solve(self, num):
        """
        Simply break the number into numbered groups (0-999) for hundreds, thousands ...
        for each number group, convert it to english then tack on grouping      
        """
        if num == 0:
            return "Zero"

        ones = [
            "", "One", "Two", "Three", "Four", 
            "Five", "Six", "Seven", "Eight", 
            "Nine", "Ten", "Eleven", "Twelve", 
            "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
            "Seventeen", "Eighteen", "Nineteen"
        ]

        tens = [
            "", "", "Twenty", "Thirty", 
            "Forty", "Fifty", "Sixty", 
            "Seventy", "Eighty", "Ninety"
        ]

        groups = ["", "Thousand", "Million", "Billion"]
        
        def to_string(num):
            """
            Convert an integer num to english, assumes num < 1000. 
            """
            s = ''
            if num > 0:
                if num > 99:
                    s = ones[num // 100] + ' Hundred '
                num = num % 100
                if num > 19:
                    s += tens[num // 10] + ' ' + ones[num % 10]
                else:
                    s += ones[num]
            return s.strip()

        ans = ''
        group = 0        
        while num > 0:
            # convert the number group to english
            s = to_string(num % 1000)
            # if number group > 0 add to previous group we converted (note to the left) 
            if s != '':
                ans = s + ' ' + groups[group] + ' ' + ans
            group += 1
            num = num // 1000
                
        return ans.strip()