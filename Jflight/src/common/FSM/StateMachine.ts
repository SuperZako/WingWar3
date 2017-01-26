class StateMachine<entity_type> {
    ////a pointer to the agent that owns this instance

    // private owner: entity_type;
    private currentState: State<entity_type>;
    //a record of the last state the agent was in
    private previousState: State<entity_type>;
    //this is called every time the FSM is updated
    private globalState: State<entity_type>;

    public constructor(public owner: entity_type) {
        //this.owner = owner;
        //this.m_pCurrentState = null;
        //this.m_pPreviousState = null;
        //this.m_pGlobalState = null;
    }

    //@Override
    //protected void finalize() throws Throwable {
    //    super.finalize();
    //}

    //use these methods to initialize the FSM
    public SetCurrentState(s: State<entity_type>) {
        this.currentState = s;
    }

    public SetGlobalState(s: State<entity_type>) {
        this.globalState = s;
    }

    public SetPreviousState(s: State<entity_type>) {
        this.previousState = s;
    }

    //call this to update the FSM
    public Update() {
        //if a global state exists, call its execute method, else do nothing
        if (this.globalState !== null) {
            this.globalState.execute(this.owner);
        }

        //same for the current state
        if (this.currentState !== null) {
            this.currentState.execute(this.owner);
        }
    }

    public HandleMessage(msg: /*Telegram*/any) {
        //first see if the current state is valid and that it can handle
        //the message
        if (this.currentState != null && this.currentState.onMessage(this.owner, msg)) {
            return true;
        }

        //if not, and if a global state has been implemented, send 
        //the message to the global state
        if (this.globalState != null && this.globalState.onMessage(this.owner, msg)) {
            return true;
        }

        return false;
    }

    //change to a new state
    public ChangeState(pNewState: State<entity_type>) {
        //assert pNewState != null : "<StateMachine::ChangeState>: trying to change to NULL state";

        //keep a record of the previous state
        this.previousState = this.currentState;

        //call the exit method of the existing state
        this.currentState.exit(this.owner);

        //change state to the new state
        this.currentState = pNewState;

        //call the entry method of the new state
        this.currentState.enter(this.owner);
    }

    ////change state back to the previous state
    //public void RevertToPreviousState() {
    //    ChangeState(m_pPreviousState);
    //}

    //returns true if the current state's type is equal to the type of the
    //class passed as a parameter. 
    public isInState(st: State<entity_type>) {
        //return this.m_pCurrentState/*.getClass()*/ == st/*.getClass()*/;
        return this.currentState.getName() === st.getName();
    }

    public CurrentState() {
        return this.currentState;
    }

    public GlobalState() {
        return this.globalState;
    }

    //public State<entity_type> PreviousState() {
    //    return m_pPreviousState;
    //}
    ////only ever used during debugging to grab the name of the current state

    public GetNameOfCurrentState() {
        //let s = this.m_pCurrentState.getClass().getName().split("\\.");
        //let s = this.m_pCurrentState.getName().split("\\.");
        //if (s.length > 0) {
        //    return s[s.length - 1];
        //}
        return this.currentState.getName();
    }
}
