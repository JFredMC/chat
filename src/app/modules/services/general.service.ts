import { BehaviorSubject, Observable, Subscription } from "rxjs";

export abstract class GeneralReportService<T> {
    // Private fields
    private _items$ = new BehaviorSubject<T[]>([]);
    public _isLoading$ = new BehaviorSubject<boolean>(false);
    public _errorMessage = new BehaviorSubject<string>('');
    private _subscriptions: Subscription[] = [];


    // Getters
    get items$(): Observable<T[]> {
        return this._items$.asObservable();
    }

    get isLoading$(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }
    get errorMessage$(): Observable<string> {
        return this._errorMessage.asObservable();
    }
    get subscriptions(): Subscription[] {
        return this._subscriptions;
    }
}