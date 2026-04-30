
Action: file_editor view /app/test_result.md
Observation: [Showing lines 75-103 of 103 total] /app/test_result.md:
75|#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
76|#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
77|#
78|# 3. Track Stuck Tasks:
79|#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
80|#    - For persistent issues, use websearch tool to find solutions
81|#    - Pay special attention to tasks in the stuck_tasks list
82|#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
83|#
84|# 4. Provide Context to Testing Agent:
85|#    - When calling the testing agent, provide clear instructions about:
86|#      - Which tasks need testing (reference the test_plan)
87|#      - Any authentication details or configuration needed
88|#      - Specific test scenarios to focus on
89|#      - Any known issues or edge cases to verify
90|#
91|# 5. Call the testing agent with specific instructions referring to test_result.md
92|#
93|# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.
94|
95|#====================================================================================================
96|# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
97|#====================================================================================================
98|
99|
100|
101|#====================================================================================================
102|# Testing Data - Main Agent and testing sub agent both should log testing data below this section
103|#====================================================================================================
[End of file]
