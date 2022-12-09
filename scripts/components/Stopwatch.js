export class Stopwatch {
    constructor(value) { //Delay in ms
      this.state = "paused";
      this.delay = .001;
      this.value = 0;
    }
    
    update() {
      if (this.state=="running") {
        this.value += this.delay;
      }
      //this.display.innerHTML = this.value
      return this.value
      
    }
    
    start() {
      if (this.state=="paused") {
        this.state="running";
        if (!this.interval) {
          var t=this;
          this.interval = setInterval(function(){t.update();}, this.delay);
        }
      }
      
      //return this.value
      
    }
    
    stop() {
         if (this.state=="running") {
        this.state="paused";
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
         }
      //console.log(this.value)
    }
    
    reset() {
      this.stop();
      this.value=0;
      this.update();
    }
  }
  
  // stopwatch = new Stopwatch("stopwatch");
  // stopwatch.start()
  