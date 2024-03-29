

class VoiceHelper {
    
    static whisper(message){
        return `<amazon:effect name="whispered">${message}</amazon:effect>`
    };

    static disappointed(message){
        return `<amazon:emotion name="disappointed" intensity="high">${message}</amazon:emotion>`;
    }

    static excited(message){
        return `<amazon:emotion name="excited" intensity="high">${message}</amazon:emotion>`;
    }

    static emphasis(message, level){
        return `<emphasis level="${level}">${message}</emphasis>`;
    }

    static list(messageList){
        let finalMessage = "";
        for(const message of messageList){
            finalMessage += this.paragraph(message);
        }
        return finalMessage;
    }

    static paragraph(message){
        return `<p>${message}</p>`;
    }
}

module.exports = VoiceHelper;