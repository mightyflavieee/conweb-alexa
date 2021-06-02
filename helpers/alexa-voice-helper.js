

module.exports = function(){
    this.whisper = function(message){
        return `<amazon:effect name="whispered">${message}</amazon:effect>`
    };

    this.disappointed = function(message){
        return `<amazon:emotion name="disappointed" intensity="medium">${message}</amazon:emotion>`;
    }

    this.excited = function(message){
        return `<amazon:emotion name="excited" intensity="medium">${message}</amazon:emotion>`;
    }
}