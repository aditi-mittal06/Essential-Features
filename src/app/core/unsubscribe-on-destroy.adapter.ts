import { type OnDestroy, Component } from '@angular/core';
import { SubSink } from 'subsink';

/*
guiding lights:
https://blog.angulartraining.com/how-to-automatically-unsubscribe-your-rxjs-observables-tutorial-2f98b0560298
https://github.com/wardbell/subsink
*/

/**
 * A class that automatically unsubscribes all observables when
 * the object gets destroyed
 */
@Component({
  template: '',
  standalone: true,
})
export class UnsubscribeOnDestroyAdapterComponent implements OnDestroy {
  /**The subscription sink object that stores all subscriptions */
  subs: SubSink = new SubSink();
  /**
   * The lifecycle hook that unsubscribes all subscriptions
   * when the component / object gets destroyed
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
