Now update the submit button to show loading state:
Action: file_editor str_replace /app/frontend/src/components/Contact.jsx --old-str "                <Button
                  type=\"submit\"
                  className=\"bg-[#d4fb3a] text-[#0b0b0c] hover:bg-[#bfe82b] rounded-full h-12 px-6 text-[15px] font-medium\"
                >
                  {submitted ? (
                    <>Sent <CheckCircle2 className=\"w-4 h-4 ml-2\" /></>
                  ) : (
                    <>Send message <Send className=\"w-4 h-4 ml-2\" /></>
                  )}
                </Button>" --new-str "                <Button
                  type=\"submit\"
                  disabled={loading}
                  className=\"bg-[#d4fb3a] text-[#0b0b0c] hover:bg-[#bfe82b] rounded-full h-12 px-6 text-[15px] font-medium disabled:opacity-70\"
                >
                  {loading ? (
                    <>Sending <Loader2 className=\"w-4 h-4 ml-2 animate-spin\" /></>
                  ) : submitted ? (
                    <>Sent <CheckCircle2 className=\"w-4 h-4 ml-2\" /></>
                  ) : (
                    <>Send message <Send className=\"w-4 h-4 ml-2\" /></>
                  )}
                </Button>"
Observation: Edit was successful.
