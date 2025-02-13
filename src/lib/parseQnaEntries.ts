interface QnAEntry {
    question: string;
    answer: string;
    options?: string[] | null;
    explanation?: string | null;
}

export const parseQnaEntries = (completion: string, questionType: "subjective" | "mcq"): QnAEntry[] => {
    
    if (!completion || typeof completion !== 'string') {
        throw new Error("Invalid completion input");
    }

    console.log("Raw completion input (String):", completion);
    
    const qnaEntries: QnAEntry[] = [];
    const entries = completion.trim().split('##############'); // Split based on two newlines

    console.log("Entries (Array): " + entries)

    for (const entry of entries) {
        const qna = entry.split('\n').map(line => line.trim()).filter(line => line !== ''); // Trim lines and filter out blank lines
        console.log("New qna: ", qna)

        // Skip empty entries
        if (qna.length === 0) continue;

        let question = '';
        let answer = '';
        let options: string[] = [];
        let explanation: string | null = null;

        // Extract question and answer based on question type
        if (questionType === 'subjective') {

            question = qna[0].replace(/^Q \[\d+\]:\s*/, '').trim();

            const answerLine = qna.find(line => line.startsWith('Ans:'));
            answer = answerLine ? answerLine.replace(/^Ans:\s*/, '').trim() : '';
        } else { // MCQ
            question = qna[0].replace(/^Q \[\d+\]:\s*/, '').trim();

            // Assuming options are listed after "Options:"
            const optionsLineIndex = qna.findIndex(line => line.startsWith('Options:'));
            if (optionsLineIndex !== -1) {
                options = qna.slice(optionsLineIndex + 1, qna.length - 2) // Collect options until the last two lines (Ans and Explanation)
                    .map(option => option.replace(/^(\d+\.\s)/, '').trim());
            }
        }

        const answerLine = qna.find(line => line.startsWith('Ans:'));
        if (answerLine) {
            answer = answerLine.replace(/^Ans:\s*/, '').trim();
        }

        const explanationLine = qna.find(line => line.startsWith('Explanation:'));
        if (explanationLine) {
            explanation = explanationLine.replace(/^Explanation:\s*/, '').trim();
        }

        // Push the constructed QnAEntry object
        qnaEntries.push({ 
            question, 
            answer, 
            options: options, 
            explanation: explanation});
    }

    console.log("All Qnas: ")
    console.log(qnaEntries)

    return qnaEntries;
};
