import { Component, OnInit, VERSION } from '@angular/core';
import {
  filter,
  map,
  Observable,
  Observer,
  retry,
  Subscription,
  tap,
} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  public valueToDisplay: number;
  public oservable: Observable<number>;

  ngOnInit() {
    this.oservable = new Observable<number>((observer: Observer<number>) => {
      // observer.next => Nouveau message à envoyer
      // observer.error => Une erreur est survenue, coupe court à la communication
      // observer.complete => Permet de mettre fin à la communication, tout s'est bien terminé

      let counter = 0;

      const idInterval = setInterval(() => {
        observer.next(counter++);
      }, 1000);

      // TEAR DOWN LOGIC
      return () => {
        console.log('TEAR DOWN LOGIC');
        // Permet de libérer la mémoire manuellement à la fin de l'observable
        clearInterval(idInterval);
      };
    });

    const subscriber: Subscription = this.oservable
      .pipe(
        map((x) => x * x),
        tap(console.log),
        filter((x) => x % 2 === 0)
      )
      .subscribe(
        (state) => {
          // .next - OBLIGATOIRE
          this.valueToDisplay = state;
        },
        () => {}, // .error
        () => {
          // .complete
          console.log('Communication terminée !');
        }
      );

    setTimeout(() => {
      subscriber.unsubscribe();
    }, 4000);
  }
}
