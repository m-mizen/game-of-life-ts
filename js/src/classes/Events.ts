interface Dict<T> {
  [Key: string]: T;
}

class Events{

  protected _hooks:Dict<Dict<Function>> = {}

  /**
   * Add the initial events to the hooks Dictionary
   */
  constructor( events:Array<string> ){
    for (let i = 0; i < events.length; i++) {
      this._hooks[events[i]] = {}
    }
  }

  /**
   * Add a function to be called when a hook is triggered.
   */
  subscribe(hook:string, name:string, func:Function):boolean{

    if (!this._hooks[hook]){
      return false
    }

    if (this._hooks[hook][name] !== undefined){
      console.log('This name has already been used. Pease choose another')
      return false
    }

    this._hooks[hook][name] = func;

    return true
  }

  /**
   * Remove a function from a hook. Use the same name that was used to subscribe the function
   */
  unSubscribe(hook: string, name:string):boolean{
    if (!this._hooks[hook] || !this._hooks[hook][name]){
      return false
    }
    delete this._hooks[hook][name]
    return true
  }

  /**
   * Trigger a hook
   */
  trigger(hook:string){
    if (!this._hooks[hook]){
      return false
    }
    try{
      for (const funcName in this._hooks[hook]) {
        if (this._hooks[hook].hasOwnProperty(funcName)) {
          this._hooks[hook][funcName]();
        }
      }
    } catch (e){
      throw new Error(`Error triggering hook: ${hook}.`)
    }
    return true
  }

  /**
   * Add a new hook
   */
  addEvent(name:string):boolean{
    if (this._hooks[name] !== undefined){
      return false
    }
    this._hooks[name] = {}
    return true
  }

  get list():Array<string>{
    return Object.keys(this._hooks)
  }
}

export default Events