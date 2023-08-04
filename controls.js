// controls the car with keyboard arrows
class Controls{
    constructor(controlType){
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        switch(controlType){
            //we can control only the owner's car, not the other cars
            case "KEYS":
                this.#addKeyboardListeners(); // private method
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    //private method (#) : can't be accessed from outside of 'Control' class
    #addKeyboardListeners(){
        //when arrow key pressed.
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
        }

        //when arrow key released
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
        }
    }
}