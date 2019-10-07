class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initialState = config.initial;
        this.states = config.states;
        this.currentState = config.initial;
        this.stateHistory=[];
        this.stateHistory.push(this.currentState);
        this.undoHistory =[];
        this.alreadyTrigger = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        this.alreadyTrigger = false;
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this.alreadyTrigger = false;
        this.currentState = state;
        this.stateHistory.push(state);
        if (this.states[state] == null) throw new Error;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.alreadyTrigger = true;
        if(this.states[this.currentState].transitions[event] === undefined){
            throw new Error();
        }
        this.currentState = this.states[this.currentState].transitions[event];
        this.stateHistory.push(this.currentState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.alreadyTrigger = false;
        this.currentState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event ) {
        this.alreadyTrigger = false;
        if(typeof event === "undefined"){
            return Object.keys(this.states) ;
        }
        let states = [];
        for (let state of Object.keys(this.states)){
            for (let transition of Object.keys(this.states[state].transitions)){
                if (transition === event){
                    states.push(state);
                    break;
                }
            }
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        this.alreadyTrigger = false;
        if(this.stateHistory.length === 0 || this.currentState ===this.initialState){
                return false;
        }
        this.undoHistory.push(this.stateHistory.pop());
        this.currentState = this.stateHistory[this.stateHistory.length-1];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.alreadyTrigger){
            return false;
        }
        this.alreadyTrigger = false;
        if(this.undoHistory.length ===0){
            return false;
        }
        let event = this.undoHistory.pop();
        this.currentState = event;
        this.stateHistory.push(event);
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.alreadyTrigger = false;
        this.stateHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
