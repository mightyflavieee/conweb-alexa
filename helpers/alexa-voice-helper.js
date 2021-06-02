

class VoiceHelper {
    
    static whisper(message){
        return `<amazon:effect name="whispered">${message}</amazon:effect>`
    };

    static disappointed(message){
        return `<amazon:emotion name="disappointed" intensity="medium">${message}</amazon:emotion>`;
    }

    static excited(message){
        return `<amazon:emotion name="excited" intensity="medium">${message}</amazon:emotion>`;
    }
}

module.exports = VoiceHelper;