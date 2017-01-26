abstract class State<entity_type>  {

    //@Override
    //public void finalize() throws Throwable{ super.finalize();}

    //private name: string;

    public abstract getName(): string;

    //this will execute when the state is entered
    public abstract enter(e: entity_type): void;

    //this is the state's normal update function
    public abstract execute(e: entity_type): void;

    //this will execute when the state is exited. (My word, isn't
    //life full of surprises... ;o))
    public abstract exit(e: entity_type): void;

    ////this executes if the agent receives a message from the 
    ////message dispatcher
    public abstract onMessage(e: entity_type, t:/* Telegram*/any): boolean;
}
