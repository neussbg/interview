## Вопросы на собеседовании по Angular [![Angular-RU](https://img.shields.io/badge/Telegram_chat:-Angular_RU-216bc1.svg?style=flat)](https://t.me/angular_ru)

Вопросы подготовлены непосредственно для того, чтобы определить уровень разработчика, насколько глубоко, поверхностно или сносно он знает Angular. Вопросы для собеседования на знание JavaScript или Web-стека хорошо освещены в других местах, поэтому ниже будет добавлен список ресурсов по этой теме:

**Fundamentals**:

- [Coding Interview University](https://github.com/jwasham/coding-interview-university)
- [Awesome Interviews](https://github.com/alex/what-happens-when)
- [Angular Interview Questions](https://github.com/sudheerj/angular-interview-questions)

**Frontend**:

- [Front-end Job Interview Questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions)
- [The Best Frontend JavaScript Interview Questions](<https://performancejs.com/post/hde6d32/The-Best-Frontend-JavaScript-Interview-Questions-(Written-by-a-Frontend-Engineer)>)
- [Frontend Guidelines Questionnaire](https://github.com/bradfrost/frontend-guidelines-questionnaire)
- [Подготовка к интервью на Front-end разработчика](https://proglib.io/p/frontend-interview/)

**Angular**:

- [Angular Interview Questions by Google Developer Expert](https://github.com/Yonet/Angular-Interview-Questions)

# Вопросы для собеседования по Angular

## 1. Что такое интерцепторы в Angular?

Интерцепторы (Interceptors) — это механизм в Angular, который позволяет перехватывать и модифицировать HTTP-запросы и ответы перед их обработкой. Интерцепторы реализуют интерфейс `HttpInterceptor` и встраиваются в цепочку обработки HTTP-запросов.

Основные возможности интерцепторов:

- Добавление заголовков к запросам (например, авторизационных токенов)
- Логирование запросов и ответов
- Обработка ошибок на глобальном уровне
- Кэширование ответов
- Преобразование данных запросов и ответов
- Отображение индикаторов загрузки

Пример интерцептора:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Клонируем запрос и добавляем заголовок авторизации
    const authReq = req.clone({
      headers: req.headers.set(
        "Authorization",
        `Bearer ${this.authService.getToken()}`
      ),
    });

    // Передаем измененный запрос следующему обработчику
    return next.handle(authReq);
  }
}
```

Регистрация интерцептора в модуле:

```typescript
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
```

## 2. Что такое гуарды в Angular?

Гуарды (Guards) — это механизм в Angular, который позволяет контролировать доступ к маршрутам приложения. Гуарды реализуют различные интерфейсы (`CanActivate`, `CanActivateChild`, `CanDeactivate`, `CanLoad`, `Resolve`) и используются для защиты маршрутов от несанкционированного доступа или выполнения определенных условий перед навигацией.

Основные типы гуардов:

- **CanActivate** — определяет, может ли пользователь получить доступ к конкретному маршруту
- **CanActivateChild** — определяет, может ли пользователь получить доступ к дочерним маршрутам
- **CanDeactivate** — проверяет, может ли пользователь покинуть текущий маршрут (например, если есть несохраненные изменения)
- **CanLoad** — предотвращает загрузку модуля с ленивой загрузкой, если пользователь не имеет доступа
- **Resolve** — предварительно загружает данные перед активацией маршрута

Пример гуарда авторизации:

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    return this.router.createUrlTree(["/login"], {
      queryParams: { returnUrl: state.url },
    });
  }
}
```

Использование гуарда в конфигурации маршрутов:

```typescript
const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];
```

## 3. Что такое NGXS, почему он лучше NgRx в Angular и зачем он нужен, если есть сервисы?

NGXS — это библиотека управления состоянием для Angular, основанная на концепции единого источника истины (single source of truth) и вдохновленная Redux. NGXS обеспечивает предсказуемый, основанный на действиях подход к управлению состоянием приложения.

### Почему NGXS считается лучше NgRx:

1. **Меньше шаблонного кода**: NGXS требует меньше шаблонного кода и имеет более простой API по сравнению с NgRx.

2. **Использование декораторов и классов**: NGXS полагается на декораторы и классы TypeScript, что делает его более понятным для разработчиков, знакомых с Angular.

3. **Встроенная поддержка селекторов**: Селекторы в NGXS имеют поддержку мемоизации из коробки и легко компонуются.

4. **Встроенная поддержка асинхронных операций**: NGXS упрощает обработку асинхронных действий с помощью async/await.

5. **Зависимость от DI**: NGXS тесно интегрируется с системой внедрения зависимостей Angular, что упрощает тестирование и доступ к сервисам.

### Зачем NGXS, если есть сервисы:

1. **Централизованное управление состоянием**: NGXS предоставляет единый источник истины для состояния приложения, что упрощает отладку и понимание потока данных.

2. **Иммутабельность**: NGXS обеспечивает иммутабельность состояния, что предотвращает непредсказуемые изменения данных.

3. **Прозрачность действий**: Все изменения состояния происходят через действия, что делает поток данных более предсказуемым и отслеживаемым.

4. **Инструменты разработчика**: NGXS интегрируется с Redux DevTools, что позволяет отслеживать изменения состояния и отлаживать приложение.

5. **Более простая обработка сложных потоков данных**: NGXS упрощает работу с асинхронными операциями и зависимостями между состояниями.

6. **Кэширование и сохранение состояния**: NGXS имеет встроенную поддержку для сохранения состояния (persistence) в localStorage или sessionStorage.

Пример использования NGXS:

```typescript
// Определение состояния
@State<TodoStateModel>({
  name: "todos",
  defaults: {
    items: [],
  },
})
@Injectable()
export class TodoState {
  @Selector()
  static getTodos(state: TodoStateModel) {
    return state.items;
  }

  @Action(AddTodo)
  add(ctx: StateContext<TodoStateModel>, action: AddTodo) {
    const state = ctx.getState();
    ctx.setState({
      items: [...state.items, action.payload],
    });
  }
}

// Использование в компоненте
@Component({})
export class TodoComponent {
  @Select(TodoState.getTodos) todos$: Observable<Todo[]>;

  constructor(private store: Store) {}

  addTodo(title: string) {
    this.store.dispatch(new AddTodo({ title, completed: false }));
  }
}
```

Выбор между сервисами и NGXS зависит от сложности приложения. Для небольших приложений сервисы могут быть достаточными, но для крупных приложений с сложной логикой состояния NGXS предоставляет более структурированный и масштабируемый подход к управлению состоянием.

# Ответы на вопросы о маршрутизации и управлении состоянием в Angular

<details>
<summary><b>Как работает маршрутизация в Angular?</b></summary>

1. **Маршрутизация в Angular** — это механизм, который позволяет создавать одностраничные приложения (SPA) с несколькими представлениями и навигацией между ними без перезагрузки страницы. Маршрутизатор Angular интерпретирует URL браузера как инструкцию для перехода к определённому представлению или компоненту.

2. **Настройка маршрутизации** выполняется через определение массива routes, где каждый маршрут связывает путь URL с компонентом:

   ```typescript
   const routes: Routes = [
     { path: "", component: HomeComponent },
     { path: "users", component: UsersComponent },
     { path: "users/:id", component: UserDetailComponent },
     {
       path: "admin",
       loadChildren: () =>
         import("./admin/admin.module").then((m) => m.AdminModule),
     },
     { path: "**", component: NotFoundComponent },
   ];

   // Регистрация в NgModule
   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule],
   })
   export class AppRoutingModule {}

   // Или для standalone-приложений
   bootstrapApplication(AppComponent, {
     providers: [provideRouter(routes)],
   });
   ```

3. **Базовые компоненты маршрутизации**:
   - `<router-outlet>` — директива, отмечающая место в шаблоне, куда будет вставлен компонент активного маршрута
   - `RouterLink` — директива для создания ссылок на маршруты (`[routerLink]="['/users', userId]"`)
   - `RouterLinkActive` — директива для добавления классов активным ссылкам
   - `Router` — сервис для программной навигации (`router.navigate(['/users', userId])`)
4. **Расширенные возможности маршрутизации** включают:

   - **Параметры маршрута** — динамические части URL (`users/:id`)
   - **Параметры запроса** — дополнительные параметры (`users?sortBy=name`)
   - **Защита маршрутов** — через Guards (`canActivate`, `canDeactivate`, `canLoad`)
   - **Разрешение данных** — предварительная загрузка данных через Resolver
   - **Ленивая загрузка** — загрузка модулей по требованию
   - **Именованные аутлеты** — несколько аутлетов на одной странице

5. **Жизненный цикл маршрутизации** включает следующие шаги:
   - Распознавание URL и сопоставление с объявленными маршрутами
   - Проверка Guard'ов и разрешений
   - Разрешение данных через Resolver'ы
   - Активация маршрута и создание компонентов
   - Обновление URL в адресной строке
   - Активация дочерних маршрутов (если есть)
   </details>

<details>
<summary><b>Что такое Guards в Angular Router?</b></summary>

1. **Guards (охранники)** — это механизмы, позволяющие контролировать доступ к маршрутам, выход из них или загрузку модулей на основе определённых условий. Guards помогают реализовать авторизацию, предотвратить потерю несохранённых данных, обеспечить предварительную загрузку данных и другие сценарии навигации.

2. **Основные типы Guards в Angular**:

   - `CanActivate` — контролирует доступ к маршруту (например, проверка авторизации)
   - `CanActivateChild` — контролирует доступ к дочерним маршрутам
   - `CanDeactivate` — контролирует выход из маршрута (например, подтверждение при несохранённых изменениях)
   - `CanLoad` — контролирует ленивую загрузку модуля
   - `CanMatch` — контролирует, будет ли маршрут сопоставлен (Angular 15+)

3. **Создание и реализация Guard** (пример для авторизации):

   ```typescript
   // Функциональный подход (рекомендуется с Angular 14+)
   export const authGuard = () => {
     const router = inject(Router);
     const authService = inject(AuthService);

     if (authService.isAuthenticated()) {
       return true;
     }

     // Сохраняем целевой URL для перенаправления после логина
     return router.parseUrl(
       "/login?returnUrl=" + encodeURIComponent(router.url)
     );
   };

   // Классовый подход (устаревший, но все еще поддерживается)
   @Injectable({ providedIn: "root" })
   export class AuthGuard implements CanActivate {
     constructor(private router: Router, private authService: AuthService) {}

     canActivate(
       route: ActivatedRouteSnapshot,
       state: RouterStateSnapshot
     ): boolean | UrlTree {
       if (this.authService.isAuthenticated()) {
         return true;
       }
       return this.router.parseUrl("/login");
     }
   }
   ```

4. **Применение Guards в маршрутах**:

   ```typescript
   const routes: Routes = [
     { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
     {
       path: "admin",
       loadChildren: () =>
         import("./admin/admin.module").then((m) => m.AdminModule),
       canLoad: [adminGuard],
       canMatch: [roleGuard],
     },
     {
       path: "editor",
       component: EditorComponent,
       canDeactivate: [(component: EditorComponent) => component.canExit()],
     },
     {
       path: "dashboard",
       component: DashboardComponent,
       children: [{ path: "settings", component: SettingsComponent }],
       canActivateChild: [authGuard],
     },
   ];
   ```

5. **Объединение нескольких Guards** — если маршрут имеет несколько Guards, все они должны вернуть `true` для активации маршрута. Это позволяет комбинировать различные проверки, такие как аутентификация и авторизация:
   ```typescript
   {
     path: 'admin-dashboard',
     component: AdminDashboardComponent,
     canActivate: [authGuard, adminRoleGuard, featureToggleGuard]
   }
   ```
   </details>

<details>
<summary><b>Как использовать NgRx для управления состоянием в Angular?</b></summary>

1. **NgRx** — это реализация паттерна Redux для Angular, предоставляющая предсказуемое управление состоянием приложения с использованием однонаправленного потока данных. NgRx особенно полезен для сложных приложений с множеством взаимодействующих компонентов и асинхронных операций.

2. **Основные концепции NgRx**:

   - **Store** — единое хранилище состояния всего приложения (иммутабельное)
   - **Actions** — объекты, описывающие события в приложении
   - **Reducers** — чистые функции, которые принимают текущее состояние и действие, возвращая новое состояние
   - **Selectors** — функции для извлечения и преобразования данных из состояния
   - **Effects** — обработчики побочных эффектов (HTTP-запросы, WebSocket и т.д.)
   - **Entities** — упрощает работу с коллекциями объектов

3. **Настройка NgRx в приложении**:

   ```typescript
   // Установка пакетов
   // npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools

   // Определение состояния
   export interface AppState {
     users: UserState;
     // другие срезы состояния
   }

   // Регистрация в модуле
   @NgModule({
     imports: [
       StoreModule.forRoot(reducers, { metaReducers }),
       EffectsModule.forRoot([UserEffects]),
       StoreDevtoolsModule.instrument({
         maxAge: 25,
         logOnly: environment.production,
       }),
     ],
   })
   export class AppModule {}
   ```

4. **Основные компоненты NgRx на практике**:

   ```typescript
   // 1. Действия (Actions)
   export const loadUsers = createAction("[User] Load Users");
   export const loadUsersSuccess = createAction(
     "[User] Load Users Success",
     props<{ users: User[] }>()
   );
   export const loadUsersFailure = createAction(
     "[User] Load Users Failure",
     props<{ error: any }>()
   );

   // 2. Редьюсеры (Reducers)
   const initialState: UserState = {
     users: [],
     loading: false,
     error: null,
   };

   export const userReducer = createReducer(
     initialState,
     on(loadUsers, (state) => ({ ...state, loading: true })),
     on(loadUsersSuccess, (state, { users }) => ({
       ...state,
       users,
       loading: false,
     })),
     on(loadUsersFailure, (state, { error }) => ({
       ...state,
       error,
       loading: false,
     }))
   );

   // 3. Селекторы (Selectors)
   export const selectUserState = (state: AppState) => state.users;
   export const selectAllUsers = createSelector(
     selectUserState,
     (state: UserState) => state.users
   );
   export const selectUserLoading = createSelector(
     selectUserState,
     (state: UserState) => state.loading
   );

   // 4. Эффекты (Effects)
   @Injectable()
   export class UserEffects {
     loadUsers$ = createEffect(() =>
       this.actions$.pipe(
         ofType(loadUsers),
         switchMap(() =>
           this.userService.getUsers().pipe(
             map((users) => loadUsersSuccess({ users })),
             catchError((error) => of(loadUsersFailure({ error })))
           )
         )
       )
     );

     constructor(private actions$: Actions, private userService: UserService) {}
   }
   ```

5. **Использование NgRx в компонентах**:

   ```typescript
   @Component({
     selector: "app-user-list",
     template: `
       <div *ngIf="loading$ | async">Загрузка...</div>
       <div *ngIf="error$ | async as error">Ошибка: {{ error }}</div>
       <ul>
         <li *ngFor="let user of users$ | async">{{ user.name }}</li>
       </ul>
       <button (click)="loadUsers()">Загрузить пользователей</button>
     `,
   })
   export class UserListComponent implements OnInit {
     users$ = this.store.select(selectAllUsers);
     loading$ = this.store.select(selectUserLoading);
     error$ = this.store.select(selectUserError);

     constructor(private store: Store<AppState>) {}

     ngOnInit() {
       this.loadUsers();
     }

     loadUsers() {
       this.store.dispatch(loadUsers());
     }
   }
   ```

   </details>

<details>
<summary><b>Какие существуют альтернативы NgRx для управления состоянием?</b></summary>

1. **Angular Signals** — новый встроенный в Angular (версии 16+) механизм для управления реактивным состоянием. Сигналы представляют собой значения, которые отслеживают свои зависимости и уведомляют подписчиков об изменениях:

   ```typescript
   // Создание состояния с помощью сигналов
   export class UserStore {
     private usersSignal = signal<User[]>([]);
     private loadingSignal = signal<boolean>(false);
     private errorSignal = signal<string | null>(null);

     // Computed-значения (селекторы)
     public users = this.usersSignal.asReadonly();
     public loading = this.loadingSignal.asReadonly();
     public error = this.errorSignal.asReadonly();
     public userCount = computed(() => this.usersSignal().length);

     constructor(private http: HttpClient) {}

     loadUsers() {
       this.loadingSignal.set(true);
       this.errorSignal.set(null);

       this.http.get<User[]>("/api/users").subscribe({
         next: (users) => {
           this.usersSignal.set(users);
           this.loadingSignal.set(false);
         },
         error: (err) => {
           this.errorSignal.set(err.message);
           this.loadingSignal.set(false);
         },
       });
     }

     addUser(user: User) {
       this.usersSignal.update((users) => [...users, user]);
     }
   }
   ```

2. **NGXS** — альтернатива NgRx с более простым API и меньшим шаблонным кодом, также вдохновленная Redux, но с использованием классов и декораторов для описания состояния:

   ```typescript
   // Определение состояния
   @State<UserStateModel>({
     name: "users",
     defaults: {
       users: [],
       loading: false,
       error: null,
     },
   })
   @Injectable()
   export class UserState {
     @Selector()
     static getUsers(state: UserStateModel) {
       return state.users;
     }

     @Selector()
     static isLoading(state: UserStateModel) {
       return state.loading;
     }

     constructor(private userService: UserService) {}

     @Action(LoadUsers)
     loadUsers(ctx: StateContext<UserStateModel>) {
       ctx.patchState({ loading: true });

       return this.userService.getUsers().pipe(
         tap((users) => {
           ctx.patchState({
             users,
             loading: false,
           });
         }),
         catchError((error) => {
           ctx.patchState({
             error: error.message,
             loading: false,
           });
           return throwError(error);
         })
       );
     }
   }
   ```

3. **Akita** — легковесная библиотека управления состоянием с мощным API для запросов и кеширования:

   ```typescript
   // Определение хранилища (Store)
   @StoreConfig({ name: "users" })
   export class UsersStore extends EntityStore<UsersState> {
     constructor() {
       super();
     }
   }

   // Запросы (Query)
   export class UsersQuery extends QueryEntity<UsersState> {
     selectLoading$ = this.select((state) => state.loading);

     constructor(protected store: UsersStore) {
       super(store);
     }
   }

   // Сервис
   @Injectable({ providedIn: "root" })
   export class UsersService {
     constructor(private usersStore: UsersStore, private http: HttpClient) {}

     getUsers() {
       this.usersStore.setLoading(true);

       return this.http.get<User[]>("/api/users").pipe(
         tap((users) => {
           this.usersStore.set(users);
           this.usersStore.setLoading(false);
         }),
         catchError((error) => {
           this.usersStore.setError(error);
           this.usersStore.setLoading(false);
           return throwError(error);
         })
       );
     }
   }
   ```

4. **RxJS + Services** — использование RxJS с сервисами в качестве простой альтернативы сложным библиотекам управления состоянием:

   ```typescript
   @Injectable({ providedIn: "root" })
   export class UserStateService {
     // Состояние
     private usersSubject = new BehaviorSubject<User[]>([]);
     private loadingSubject = new BehaviorSubject<boolean>(false);
     private errorSubject = new BehaviorSubject<string | null>(null);

     // Публичные наблюдаемые объекты
     users$ = this.usersSubject.asObservable();
     loading$ = this.loadingSubject.asObservable();
     error$ = this.errorSubject.asObservable();

     constructor(private http: HttpClient) {}

     loadUsers() {
       this.loadingSubject.next(true);
       this.errorSubject.next(null);

       this.http
         .get<User[]>("/api/users")
         .pipe(
           catchError((err) => {
             this.errorSubject.next(err.message);
             return of([]);
           }),
           finalize(() => this.loadingSubject.next(false))
         )
         .subscribe((users) => this.usersSubject.next(users));
     }

     addUser(user: User) {
       const currentUsers = this.usersSubject.getValue();
       this.usersSubject.next([...currentUsers, user]);
     }
   }
   ```

5. **Component Store (из NgRx)** — облегченная альтернатива полноценному NgRx Store для локального управления состоянием компонентов:

   ```typescript
   @Injectable()
   export class TodosComponentStore extends ComponentStore<TodosState> {
     constructor(private http: HttpClient) {
       super({ todos: [], loading: false, error: null });
     }

     // Селекторы
     readonly todos$ = this.select((state) => state.todos);
     readonly loading$ = this.select((state) => state.loading);

     // Обновления
     readonly setLoading = this.updater((state, loading: boolean) => ({
       ...state,
       loading,
     }));

     readonly setTodos = this.updater((state, todos: Todo[]) => ({
       ...state,
       todos,
     }));

     // Эффекты
     readonly loadTodos = this.effect(() => {
       this.setLoading(true);

       return this.http.get<Todo[]>("/api/todos").pipe(
         tap((todos) => this.setTodos(todos)),
         catchError((error) => {
           this.patchState({ error: error.message });
           return of([]);
         }),
         finalize(() => this.setLoading(false))
       );
     });
   }
   ```

   </details>

<details>
<summary><b>Какие паттерны работы с маршрутизацией и состоянием считаются лучшими практиками в Angular?</b></summary>

1. **Структура маршрутизации**:

   - **Модульная структура маршрутов** — разделение маршрутов по модулям для улучшения масштабируемости и поддержки ленивой загрузки
   - **Маршруты для функциональных блоков** — организация маршрутов вокруг функциональных областей приложения
   - **Именованные маршруты** — использование статических объектов с константами путей вместо строковых литералов

   ```typescript
   export const ROUTES_CONFIG = {
     HOME: "",
     USERS: "users",
     USER_DETAILS: (id: string | number) => `users/${id}`,
     SETTINGS: "settings",
   };

   // Использование
   const routes: Routes = [
     { path: ROUTES_CONFIG.HOME, component: HomeComponent },
     { path: ROUTES_CONFIG.USERS, component: UsersComponent },
     { path: `${ROUTES_CONFIG.USERS}/:id`, component: UserDetailComponent },
   ];
   ```

2. **Управление данными маршрутизации**:

   - **Resolvers для предварительной загрузки** — загрузка данных перед активацией маршрута, чтобы пользователь не видел пустые состояния

   ```typescript
   // Функциональный resolver (Angular 14+)
   export const userResolver = () => {
     const userService = inject(UserService);
     const router = inject(Router);

     return (route: ActivatedRouteSnapshot) => {
       const id = route.paramMap.get('id');
       if (!id) return router.parseUrl('/users');

       return userService.getUser(id).pipe(
         catchError(() => {
           router.navigate(['/not-found']);
           return EMPTY;
         })
       );
     };
   };

   // Использование в маршруте
   {
     path: 'users/:id',
     component: UserDetailComponent,
     resolve: { user: userResolver }
   }
   ```

   - **Хранение текущего пути** — сохранение URL для перенаправления после аутентификации или других операций

   ```typescript
   // Сохранение URL для возврата
   @Injectable({ providedIn: 'root' })
   export class AuthService {
     private returnUrl: string = '/';

     setReturnUrl(url: string): void {
       this.returnUrl = url || '/';
     }

     getReturnUrl(): string {
       return this.returnUrl;
     }
   }

   // Использование в guard
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     if (this.authService.isLoggedIn()) return true;

     this.authService.setReturnUrl(state.url);
     return this.router.parseUrl('/login');
   }
   ```

3. **Управление состоянием**:

   - **Распределение ответственности между хранилищами** — разделение состояния приложения на логические слайсы/модули
   - **Однонаправленный поток данных** — родительские компоненты передают данные дочерним через Input, а дочерние уведомляют родительские через Output или сервисы
   - **Локальное и глобальное состояние** — использование разных подходов в зависимости от масштаба:
     - Компонентное состояние — для локальных данных (форма, UI-состояние)
     - Сервисы с RxJS — для состояния на уровне функции/страницы
     - NgRx/NGXS/Signals — для глобального состояния приложения

4. **Оптимизация производительности**:

   - **Ленивая загрузка модулей** — загрузка функциональных модулей только при обращении к соответствующим маршрутам

   ```typescript
   const routes: Routes = [
     {
       path: "admin",
       loadChildren: () =>
         import("./admin/admin.module").then((m) => m.AdminModule),
     },
   ];
   ```

   - **PreloadingStrategy** — стратегия предзагрузки модулей в фоновом режиме для балансировки между начальной загрузкой и отзывчивостью:

   ```typescript
   // Настройка RouterModule
   RouterModule.forRoot(routes, {
     preloadingStrategy: QuicklinkStrategy, // или PreloadAllModules
   });
   ```

   - **trackBy для ngFor** — оптимизация рендеринга списков при изменении данных

   ```html
   <div *ngFor="let user of users; trackBy: trackByUserId">{{ user.name }}</div>
   ```

   ```typescript
   trackByUserId(index: number, user: User): number {
     return user.id;
   }
   ```

5. **Организация кода**:

   - **Feature Store Pattern** — организация состояния по функциональным возможностям

   ```typescript
   // users/state/users.actions.ts
   // users/state/users.reducer.ts
   // users/state/users.selectors.ts
   // users/state/users.effects.ts

   // Фасад для абстрагирования от деталей реализации хранилища
   @Injectable({ providedIn: "root" })
   export class UsersFacade {
     users$ = this.store.select(UserSelectors.getUsers);
     loading$ = this.store.select(UserSelectors.getLoading);

     constructor(private store: Store) {}

     loadUsers() {
       this.store.dispatch(UserActions.loadUsers());
     }

     createUser(user: User) {
       this.store.dispatch(UserActions.createUser({ user }));
     }
   }
   ```

   - **Container/Presentational Component Pattern** — разделение компонентов на умные (с доступом к сервисам/store) и презентационные (чистое отображение)

   ```typescript
   // Контейнерный компонент (умный)
   @Component({
     selector: "app-users-page",
     template: `
       <app-users-list
         [users]="users$ | async"
         [loading]="loading$ | async"
         (userSelected)="onUserSelected($event)"
       ></app-users-list>
     `,
   })
   export class UsersPageComponent {
     users$ = this.usersFacade.users$;
     loading$ = this.usersFacade.loading$;

     constructor(private usersFacade: UsersFacade, private router: Router) {}

     ngOnInit() {
       this.usersFacade.loadUsers();
     }

     onUserSelected(userId: number) {
       this.router.navigate(["users", userId]);
     }
   }

   // Презентационный компонент (глупый)
   @Component({
     selector: "app-users-list",
     template: `
       <div *ngIf="loading">Загрузка...</div>
       <ul>
         <li
           *ngFor="let user of users; trackBy: trackById"
           (click)="select(user.id)"
         >
           {{ user.name }}
         </li>
       </ul>
     `,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class UsersListComponent {
     @Input() users: User[] = [];
     @Input() loading = false;
     @Output() userSelected = new EventEmitter<number>();

     trackById(index: number, user: User): number {
       return user.id;
     }

     select(userId: number) {
       this.userSelected.emit(userId);
     }
   }
   ```

   </details>

# Angular: Объяснение NgZone и Zone.js

<details>
<summary>
## Что такое NgZone и Zone.js, какую роль они играют и что делают?
</summary>

### Zone.js

**Zone.js** — это библиотека, которая расширяет функциональность JavaScript среды выполнения, создавая контекст выполнения (execution context) вокруг асинхронных операций. Это позволяет отслеживать и перехватывать все асинхронные операции, такие как:

- `setTimeout`, `setInterval`
- События DOM (`click`, `change` и т.д.)
- Обещания (Promises)
- XMLHttpRequest/Fetch API
- Обработчики событий

Zone.js создает «зоны» — контексты, которые сохраняются между асинхронными операциями, позволяя устанавливать связь между разными асинхронными вызовами.

```typescript
// Пример работы Zone.js
import "zone.js";

Zone.current
  .fork({
    name: "пример",
    onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
      console.log("Асинхронная операция началась");
      delegate.invokeTask(target, task, applyThis, applyArgs);
      console.log("Асинхронная операция завершена");
    },
  })
  .run(() => {
    setTimeout(() => {
      console.log("Внутри setTimeout");
    }, 0);
  });
```

### NgZone

**NgZone** — это сервис в Angular, представляющий собой обертку вокруг Zone.js. Он работает как мост между Zone.js и системой обнаружения изменений Angular.

Основные функции NgZone:

1. **Автоматическое обнаружение изменений:**

   - Когда происходит асинхронная операция внутри зоны Angular, NgZone уведомляет фреймворк о необходимости запустить проверку изменений
   - Это убирает необходимость ручного вызова `detectChanges()`

2. **Методы для управления обнаружением изменений:**

   - `run()` — выполняет код внутри Angular-зоны, автоматически запуская обнаружение изменений
   - `runOutsideAngular()` — выполняет код вне Angular-зоны, что позволяет избежать запуска обнаружения изменений

3. **События и наблюдаемые:**
   - `onStable` — Observable, который уведомляет, когда нет асинхронных задач в Angular-зоне
   - `onUnstable` — Observable, который уведомляет, когда начинается асинхронная задача в Angular-зоне
   - `isStable` — проверка, находится ли зона в стабильном состоянии

```typescript
@Component({
  selector: "app-example",
  template: `<div>{{ counter }}</div>`,
})
export class ExampleComponent {
  counter = 0;

  constructor(private ngZone: NgZone) {
    // Выполняется вне Angular-зоны — не вызывает обнаружение изменений
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.counter++;

        // Каждые 10 обновлений запускаем обнаружение изменений
        if (this.counter % 10 === 0) {
          this.ngZone.run(() => {
            console.log("Запуск обнаружения изменений");
          });
        }
      }, 1000);
    });
  }
}
```

### Практическое применение

1. **Оптимизация производительности:**

   - Тяжелые операции можно выполнять вне Angular-зоны с помощью `runOutsideAngular()`
   - Обнаружение изменений запускается только тогда, когда действительно нужно обновить UI

2. **Интеграция со сторонними библиотеками:**

   - Для библиотек, не интегрированных с Angular, можно оборачивать их вызовы в `zone.run()`

3. **Отладка и диагностика:**

   - Можно отслеживать асинхронные операции и их влияние на цикл обнаружения изменений

4. **NgZone-less режим (Angular 12+):**
   ```typescript
   // main.ts
   platformBrowserDynamic()
     .bootstrapModule(AppModule, { ngZone: "noop" })
     .catch((err) => console.error(err));
   ```

### Проблемы и подводные камни

1. **Производительность:**

   - Zone.js создает накладные расходы при перехвате всех асинхронных операций
   - В больших приложениях это может привести к снижению производительности

2. **Совместимость со сторонними библиотеками:**

   - Некоторые библиотеки могут использовать нестандартные асинхронные паттерны
   - В таких случаях может потребоваться ручное управление обнаружением изменений

3. **Отладка:**
   - Отслеживание асинхронных операций может быть сложным из-за "волшебного" обнаружения изменений

### Развитие и будущее

В последних версиях Angular (с версии 12) появилась возможность использовать Angular без Zone.js благодаря сигналам (Signals API) и другим механизмам реактивного обновления UI. Это направление активно развивается и, возможно, в будущем роль Zone.js в Angular будет уменьшаться.

```typescript
// Современный подход с использованием сигналов (Angular 17+)
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-counter",
  template: `<div>Счетчик: {{ counter() }}</div>
    <button (click)="increment()">+</button>`,
  standalone: true,
})
export class CounterComponent {
  counter = signal(0);

  increment() {
    this.counter.update((value) => value + 1);
    // Обновление UI происходит автоматически без полного цикла обнаружения изменений
  }
}
```

Понимание работы NgZone и Zone.js является ключевым для эффективной разработки на Angular, особенно при работе с асинхронными операциями и оптимизации производительности приложения.

</details>

# Ответы на вопросы о сервисах и директивах в Angular

<details>
<summary><b>Что такое сервисы в Angular и как их использовать?</b></summary>

1. **Определение сервисов** — это классы, которые инкапсулируют бизнес-логику, операции с данными, внешние взаимодействия (HTTP-запросы) и другую функциональность, не связанную напрямую с представлением. Сервисы являются одним из ключевых элементов архитектуры Angular, обеспечивающих разделение ответственности и повторное использование кода.

2. **Создание и регистрация сервиса** осуществляется с помощью декоратора `@Injectable()`, который указывает, что класс может быть внедрен в другие компоненты или сервисы через механизм инъекции зависимостей:

   ```typescript
   @Injectable({
     providedIn: "root", // Регистрация на уровне корневого модуля
   })
   export class DataService {
     // Реализация сервиса
   }
   ```

3. **Внедрение сервиса в компоненты** выполняется через конструктор компонента или с помощью функции `inject()` (для standalone компонентов в Angular 14+):

   ```typescript
   // Через конструктор
   constructor(private dataService: DataService) { }

   // Через функцию inject
   private dataService = inject(DataService);
   ```

4. **Иерархия инъекции** определяет область видимости сервиса. Сервис может быть предоставлен на разных уровнях:

   - На уровне приложения (`providedIn: 'root'`) — один экземпляр для всего приложения
   - На уровне модуля (`providers` в NgModule) — один экземпляр для всех компонентов модуля
   - На уровне компонента (`providers` в @Component) — отдельный экземпляр для каждого компонента

5. **Поведение сервисов в Angular** зависит от их конфигурации. Обычно сервисы являются синглтонами, но с использованием предоставления на разных уровнях или с разными токенами можно создавать несколько экземпляров. С Angular 14+ сервисы также могут быть standalone, не требуя объявления в NgModule.
</details>

<details>
<summary><b>Что такое директивы в Angular и какие типы директив существуют?</b></summary>

1. **Определение директив** — это специальные инструкции, которые расширяют или изменяют поведение элементов DOM. Они позволяют манипулировать DOM, изменять внешний вид элементов или добавлять им дополнительную функциональность. Директивы — один из ключевых строительных блоков Angular наряду с компонентами и сервисами.

2. **Типы директив в Angular**:

   - **Компонентные директивы** — директивы с шаблоном (компоненты)
   - **Структурные директивы** — изменяют структуру DOM (добавляют/удаляют элементы)
   - **Атрибутивные директивы** — изменяют внешний вид или поведение элементов

3. **Структурные директивы** манипулируют DOM, добавляя или удаляя элементы. Они обозначаются символом `*` перед именем:

   - `*ngIf` — условное отображение элемента
   - `*ngFor` — отображение элемента для каждого элемента коллекции
   - `*ngSwitch` — условное отображение на основе нескольких вариантов

   ```html
   <div *ngIf="isLoggedIn">Добро пожаловать, {{ username }}</div>
   <ul>
     <li *ngFor="let item of items; let i = index; trackBy: trackByFn">
       {{ i }}: {{ item.name }}
     </li>
   </ul>
   ```

4. **Атрибутивные директивы** изменяют внешний вид или поведение существующих элементов:

   - `ngClass` — добавляет/удаляет CSS-классы
   - `ngStyle` — устанавливает стили элемента
   - `ngModel` — обеспечивает двустороннюю привязку данных

   ```html
   <div [ngClass]="{'active': isActive, 'disabled': isDisabled}">Элемент</div>
   <div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">
     Текст
   </div>
   <input [(ngModel)]="username" name="username" />
   ```

5. **Создание пользовательских директив** позволяет расширить функциональность HTML:

   ```typescript
   @Directive({
     selector: "[appHighlight]",
     standalone: true,
   })
   export class HighlightDirective {
     @Input() appHighlight: string;
     @Input() defaultColor: string = "yellow";

     constructor(private el: ElementRef, private renderer: Renderer2) {}

     @HostListener("mouseenter") onMouseEnter() {
       this.highlight(this.appHighlight || this.defaultColor);
     }

     @HostListener("mouseleave") onMouseLeave() {
       this.highlight(null);
     }

     private highlight(color: string | null) {
       this.renderer.setStyle(this.el.nativeElement, "background-color", color);
     }
   }
   ```

   </details>

<details>
<summary><b>Как работает инъекция зависимостей в Angular?</b></summary>

1. **Определение инъекции зависимостей (DI)** — это паттерн проектирования, при котором объект (компонент, сервис и т.д.) получает свои зависимости извне, а не создаёт их самостоятельно. В Angular DI реализована на основе токенов и провайдеров, что позволяет создавать слабо связанные, легко тестируемые компоненты.

2. **Основные элементы системы DI в Angular**:

   - **Токены (tokens)** — уникальные идентификаторы зависимостей (классы, строки, символы)
   - **Провайдеры (providers)** — указывают, как создавать зависимости по токенам
   - **Инжекторы (injectors)** — хранят экземпляры и создают их по запросу
   - **Зависимости (dependencies)** — объекты, которые внедряются

3. **Виды провайдеров** определяют различные способы создания зависимостей:

   - **ClassProvider** — создаёт экземпляр класса (`{ provide: Service, useClass: ServiceImpl }`)
   - **ValueProvider** — предоставляет готовое значение (`{ provide: API_URL, useValue: 'https://api.example.com' }`)
   - **FactoryProvider** — использует фабричную функцию (`{ provide: Service, useFactory: () => new Service() }`)
   - **ExistingProvider** — создаёт алиас для существующего токена (`{ provide: OldService, useExisting: NewService }`)

4. **Иерархия инжекторов** в Angular образует дерево, соответствующее структуре компонентов:

   - **Корневой инжектор** (`providedIn: 'root'` или `AppModule`)
   - **Инжекторы уровня модуля** (`providers` в `@NgModule`)
   - **Инжекторы уровня компонента** (`providers` в `@Component`)
   - **ElementInjector** (создаётся для каждого элемента с директивами)

   При запросе зависимости сначала проверяется текущий инжектор, затем — родительский, и так до корневого.

5. **Современные подходы к DI в Angular 14+** включают:
   - **Функцию inject()**: `const service = inject(Service)` вместо конструктора
   - **Standalone инъекцию**: `@Injectable({ providedIn: 'root' })` без необходимости в NgModule
   - **Опциональную инъекцию**: `@Optional() service: Service` или `inject(Service, { optional: true })`
   - **Разделяемые токены**: `InjectionToken<T>` для значений и нон-класс зависимостей
   - **Контекстуальную инъекцию**: `EnvironmentInjector` и `runInInjectionContext()`
   </details>

<details>
<summary><b>Как использовать HttpClient в Angular для работы с API?</b></summary>

1. **HttpClient** — это встроенный сервис Angular для выполнения HTTP-запросов. Он предоставляет современный, мощный и типизированный API для взаимодействия с внешними ресурсами. HttpClient возвращает Observable, что позволяет эффективно обрабатывать асинхронные операции и применять операторы RxJS.

2. **Настройка HttpClient** начинается с импорта в приложение:

   ```typescript
   // В NgModule (для не-standalone приложений)
   @NgModule({
     imports: [HttpClientModule],
     // ...
   })

   // В standalone компонентах/директивах
   @Component({
     standalone: true,
     imports: [HttpClientModule],
     // ...
   })

   // Или при использовании bootstrapApplication
   bootstrapApplication(AppComponent, {
     providers: [
       importProvidersFrom(HttpClientModule)
     ]
   });
   ```

3. **Основные методы HttpClient** для различных типов запросов:

   ```typescript
   @Injectable({ providedIn: "root" })
   export class ApiService {
     constructor(private http: HttpClient) {}

     // GET запрос
     getUsers(): Observable<User[]> {
       return this.http.get<User[]>("https://api.example.com/users");
     }

     // POST запрос
     createUser(user: User): Observable<User> {
       return this.http.post<User>("https://api.example.com/users", user);
     }

     // PUT запрос
     updateUser(id: number, user: User): Observable<User> {
       return this.http.put<User>(`https://api.example.com/users/${id}`, user);
     }

     // DELETE запрос
     deleteUser(id: number): Observable<void> {
       return this.http.delete<void>(`https://api.example.com/users/${id}`);
     }
   }
   ```

4. **Обработка ответов и ошибок** с использованием операторов RxJS:

   ```typescript
   this.apiService
     .getUsers()
     .pipe(
       map((users) => users.filter((user) => user.isActive)),
       catchError((error) => {
         console.error("Ошибка при получении пользователей:", error);
         return of([]); // Возвращаем пустой массив в случае ошибки
       })
     )
     .subscribe({
       next: (users) => (this.users = users),
       error: (err) =>
         (this.errorMessage = "Не удалось загрузить пользователей"),
       complete: () => (this.loading = false),
     });
   ```

5. **Расширенные возможности HttpClient** включают настройку заголовков, параметров запроса, перехватчиков и обработку прогресса:

   ```typescript
   // Заголовки и параметры
   const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
   const params = new HttpParams().set("page", "1").set("limit", "10");

   this.http.get<User[]>("https://api.example.com/users", { headers, params });

   // Интерсепторы
   @Injectable()
   export class AuthInterceptor implements HttpInterceptor {
     intercept(
       req: HttpRequest<any>,
       next: HttpHandler
     ): Observable<HttpEvent<any>> {
       const authReq = req.clone({
         headers: req.headers.set(
           "Authorization",
           `Bearer ${this.authService.getToken()}`
         ),
       });
       return next.handle(authReq);
     }
   }

   // Мониторинг загрузки файлов
   this.http
     .post("https://api.example.com/upload", formData, {
       reportProgress: true,
       observe: "events",
     })
     .pipe(
       tap((event) => {
         if (event.type === HttpEventType.UploadProgress && event.total) {
           this.progress = Math.round((100 * event.loaded) / event.total);
         }
       })
     );
   ```

   </details>

<details>
<summary><b>Как создать и использовать пользовательскую директиву в Angular?</b></summary>

1. **Создание базовой директивы** начинается с определения класса с декоратором `@Directive`. Селектор директивы обычно указывается в квадратных скобках, чтобы использовать её как атрибут:

   ```typescript
   import { Directive, ElementRef, OnInit } from "@angular/core";

   @Directive({
     selector: "[appBorderHighlight]",
     standalone: true, // Для Angular 14+
   })
   export class BorderHighlightDirective implements OnInit {
     constructor(private el: ElementRef) {}

     ngOnInit() {
       this.el.nativeElement.style.border = "2px solid red";
     }
   }
   ```

2. **Добавление входных параметров** позволяет настраивать поведение директивы:

   ```typescript
   import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

   @Directive({
     selector: "[appBorderHighlight]",
     standalone: true,
   })
   export class BorderHighlightDirective implements OnChanges {
     @Input() appBorderHighlight: string = "red";
     @Input() borderWidth: string = "2px";

     constructor(private el: ElementRef) {}

     ngOnChanges() {
       this.el.nativeElement.style.border = `${this.borderWidth} solid ${this.appBorderHighlight}`;
     }
   }
   ```

3. **Обработка событий** с помощью декоратора `@HostListener` позволяет директиве реагировать на действия пользователя:

   ```typescript
   import { Directive, ElementRef, HostListener, Input } from "@angular/core";

   @Directive({
     selector: "[appHoverHighlight]",
     standalone: true,
   })
   export class HoverHighlightDirective {
     @Input() appHoverHighlight: string = "yellow";
     private originalColor: string;

     constructor(private el: ElementRef) {
       this.originalColor = this.el.nativeElement.style.backgroundColor || "";
     }

     @HostListener("mouseenter")
     onMouseEnter() {
       this.el.nativeElement.style.backgroundColor = this.appHoverHighlight;
     }

     @HostListener("mouseleave")
     onMouseLeave() {
       this.el.nativeElement.style.backgroundColor = this.originalColor;
     }
   }
   ```

4. **Безопасное изменение DOM** с использованием `Renderer2` вместо прямого доступа к `nativeElement.style`:

   ```typescript
   import {
     Directive,
     ElementRef,
     Renderer2,
     HostListener,
     Input,
   } from "@angular/core";

   @Directive({
     selector: "[appSafeHighlight]",
     standalone: true,
   })
   export class SafeHighlightDirective {
     @Input() appSafeHighlight: string = "yellow";

     constructor(private el: ElementRef, private renderer: Renderer2) {}

     @HostListener("mouseenter")
     onMouseEnter() {
       this.renderer.setStyle(
         this.el.nativeElement,
         "background-color",
         this.appSafeHighlight
       );
     }

     @HostListener("mouseleave")
     onMouseLeave() {
       this.renderer.removeStyle(this.el.nativeElement, "background-color");
     }
   }
   ```

5. **Использование пользовательской директивы** в шаблонах компонентов:

   ```html
   <!-- Базовое использование -->
   <div appBorderHighlight>Текст с красной границей</div>

   <!-- С параметрами -->
   <div [appBorderHighlight]="'blue'" [borderWidth]="'4px'">
     Текст с синей границей толщиной 4px
   </div>

   <!-- Директива, реагирующая на события -->
   <div [appHoverHighlight]="'lightblue'">Наведите курсор для подсветки</div>

   <!-- Импорт директивы в компоненте (для standalone) -->
   @Component({ selector: 'app-example', templateUrl:
   './example.component.html', standalone: true, imports:
   [SafeHighlightDirective] })
   ```

   </details>

<details>
<summary><b>Жизненный цикл сервисов и коммуникация между компонентами через сервисы</b></summary>

1. **Жизненный цикл сервисов в Angular**:

   - **Инициализация**: Сервисы создаются при первом запросе через инжектор
   - **Lazy Initialization**: Сервисы с `providedIn: 'root'` инициализируются лениво, только когда они впервые запрашиваются
   - **Уничтожение**: Сервисы уничтожаются при уничтожении их инжектора
     - Сервисы с `providedIn: 'root'` существуют на протяжении всего жизненного цикла приложения
     - Сервисы, предоставленные на уровне компонента, уничтожаются вместе с компонентом
   - **Хук ngOnDestroy**: Начиная с Angular 9+, сервисы могут реализовывать интерфейс `OnDestroy`:

   ```typescript
   @Injectable({ providedIn: "root" })
   export class DataService implements OnDestroy {
     private subscriptions = new Subscription();

     constructor(private http: HttpClient) {
       // Сохраняем подписки для последующей очистки
       this.subscriptions.add(
         interval(1000).subscribe((val) => console.log("Interval:", val))
       );
     }

     ngOnDestroy() {
       // Очистка ресурсов при уничтожении сервиса
       this.subscriptions.unsubscribe();
       console.log("DataService уничтожен");
     }
   }
   ```

2. **Паттерны коммуникации между компонентами через сервисы**:

   - **Сервис как хранилище состояния**:

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class SharedDataService {
     // BehaviorSubject хранит текущее значение и отправляет его новым подписчикам
     private dataSubject = new BehaviorSubject<any>(null);

     // Публичный Observable для подписки компонентов
     public data$ = this.dataSubject.asObservable();

     // Метод для обновления данных
     updateData(newData: any) {
       this.dataSubject.next(newData);
     }
   }

   // Использование в компонентах
   @Component({...})
   export class ComponentA {
     constructor(private sharedData: SharedDataService) {}

     sendDataToOtherComponents() {
       this.sharedData.updateData({ message: 'Hello from ComponentA!' });
     }
   }

   @Component({...})
   export class ComponentB implements OnInit, OnDestroy {
     data: any;
     private subscription: Subscription;

     constructor(private sharedData: SharedDataService) {}

     ngOnInit() {
       this.subscription = this.sharedData.data$.subscribe(
         data => {
           if (data) {
             this.data = data;
             console.log('Received:', data);
           }
         }
       );
     }

     ngOnDestroy() {
       this.subscription.unsubscribe();
     }
   }
   ```

3. **Паттерн Event Bus (шина событий)** для слабосвязанной коммуникации:

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class EventBusService {
     private eventSubject = new Subject<{ name: string; data: any }>();

     public events$ = this.eventSubject.asObservable();

     // Публикация события
     emit(name: string, data?: any) {
       this.eventSubject.next({ name, data });
     }

     // Подписка на конкретное событие
     on(eventName: string): Observable<any> {
       return this.events$.pipe(
         filter(event => event.name === eventName),
         map(event => event.data)
       );
     }
   }

   // Использование
   @Component({...})
   export class SenderComponent {
     constructor(private eventBus: EventBusService) {}

     sendEvent() {
       this.eventBus.emit('userLoggedIn', { id: 123, name: 'John' });
     }
   }

   @Component({...})
   export class ReceiverComponent implements OnInit, OnDestroy {
     private subscription: Subscription;

     constructor(private eventBus: EventBusService) {}

     ngOnInit() {
       this.subscription = this.eventBus.on('userLoggedIn')
         .subscribe(userData => {
           console.log('User logged in:', userData);
           // Обработка события
         });
     }

     ngOnDestroy() {
       this.subscription.unsubscribe();
     }
   }
   ```

4. **Кэширование данных в сервисах**:

   ```typescript
   @Injectable({ providedIn: "root" })
   export class CachingService {
     private cache = new Map<string, { data: any; timestamp: number }>();
     private cacheDuration = 5 * 60 * 1000; // 5 минут в миллисекундах

     constructor(private http: HttpClient) {}

     getData(url: string): Observable<any> {
       const cachedData = this.cache.get(url);
       const now = Date.now();

       // Если данные в кэше и они не устарели
       if (cachedData && now - cachedData.timestamp < this.cacheDuration) {
         console.log("Returning cached data for", url);
         return of(cachedData.data);
       }

       // Иначе делаем новый запрос и кэшируем результат
       console.log("Fetching fresh data for", url);
       return this.http.get(url).pipe(
         tap((data) => {
           this.cache.set(url, { data, timestamp: now });
         })
       );
     }

     clearCache(url?: string) {
       if (url) {
         this.cache.delete(url);
       } else {
         this.cache.clear();
       }
     }
   }
   ```

5. **Тестирование сервисов и коммуникации между компонентами**:

   ```typescript
   describe("SharedDataService", () => {
     let service: SharedDataService;

     beforeEach(() => {
       TestBed.configureTestingModule({
         providers: [SharedDataService],
       });
       service = TestBed.inject(SharedDataService);
     });

     it("should emit new value to subscribers", (done) => {
       const testData = { message: "Test data" };

       service.data$.subscribe((data) => {
         if (data === testData) {
           expect(data).toEqual(testData);
           done();
         }
       });

       service.updateData(testData);
     });
   });

   describe("Component communication via service", () => {
     let componentA: ComponentA;
     let componentB: ComponentB;
     let sharedService: SharedDataService;

     beforeEach(() => {
       TestBed.configureTestingModule({
         declarations: [ComponentA, ComponentB],
         providers: [SharedDataService],
       });

       componentA = TestBed.createComponent(ComponentA).componentInstance;
       componentB = TestBed.createComponent(ComponentB).componentInstance;
       sharedService = TestBed.inject(SharedDataService);
     });

     it("should pass data from ComponentA to ComponentB", fakeAsync(() => {
       const testData = { message: "Hello!" };

       // Инициализируем ComponentB (запустит подписку)
       componentB.ngOnInit();

       // ComponentA отправляет данные
       componentA.sendDataToOtherComponents(testData);

       // Проверяем, что ComponentB получил данные
       tick(); // Продвигаем асинхронные операции
       expect(componentB.data).toEqual(testData);

       // Очистка
       componentB.ngOnDestroy();
     }));
   });
   ```

   </details>

<details>
<summary><b>Как использовать Signals в Angular для управления состоянием и коммуникации?</b></summary>

1. **Что такое Signals в Angular**:

   - Signals — это новый реактивный примитив в Angular (с версии 16+), представляющий значение, изменяющееся со временем
   - Они обеспечивают более эффективное обнаружение изменений по сравнению с традиционной стратегией Zone.js
   - Signals автоматически отслеживают зависимости и обновляют только те части UI, которые действительно зависят от изменившихся значений
   - С Angular 17+ Signals стали рекомендуемым способом управления состоянием

2. **Основные типы и API Signals**:

   ```typescript
   import { signal, computed, effect, Signal } from "@angular/core";

   // Сигнал чтения-записи
   const count = signal(0); // Инициализация с начальным значением

   // Чтение значения (вызов функции сигнала)
   console.log(count()); // 0

   // Обновление значения
   count.set(5); // Прямая установка нового значения
   count.update((value) => value + 1); // Обновление на основе текущего значения

   // Вычисляемый сигнал (computed)
   const doubleCount = computed(() => count() * 2);
   console.log(doubleCount()); // 12 (после обновлений выше)

   // Эффект - выполняется при изменении зависимостей
   effect(() => {
     console.log(`Текущее значение: ${count()}, удвоенное: ${doubleCount()}`);
   });
   // Автоматически выполнится при изменении count
   ```

3. **Использование Signals в компонентах**:

   ```typescript
   @Component({
     selector: "app-counter",
     template: `
       <div>Count: {{ count() }}</div>
       <div>Double Count: {{ doubleCount() }}</div>
       <button (click)="increment()">+</button>
       <button (click)="decrement()">-</button>
       <button (click)="reset()">Reset</button>
     `,
   })
   export class CounterComponent {
     count = signal(0);
     doubleCount = computed(() => this.count() * 2);

     increment() {
       this.count.update((value) => value + 1);
     }

     decrement() {
       this.count.update((value) => value - 1);
     }

     reset() {
       this.count.set(0);
     }
   }
   ```

4. **Управление состоянием с помощью Signals в сервисах**:

   ```typescript
   // Модель данных
   interface User {
     id: number;
     name: string;
     email: string;
     isActive: boolean;
   }

   @Injectable({ providedIn: "root" })
   export class UserStateService {
     // Приватные сигналы для внутреннего использования
     private usersSignal = signal<User[]>([]);
     private loadingSignal = signal<boolean>(false);
     private errorSignal = signal<string | null>(null);

     // Публичные сигналы только для чтения
     public users = this.usersSignal.asReadonly();
     public loading = this.loadingSignal.asReadonly();
     public error = this.errorSignal.asReadonly();

     // Вычисляемые сигналы
     public activeUsers = computed(() =>
       this.usersSignal().filter((user) => user.isActive)
     );

     public userCount = computed(() => this.usersSignal().length);

     constructor(private http: HttpClient) {}

     fetchUsers() {
       this.loadingSignal.set(true);
       this.errorSignal.set(null);

       this.http.get<User[]>("/api/users").subscribe({
         next: (users) => {
           this.usersSignal.set(users);
           this.loadingSignal.set(false);
         },
         error: (err) => {
           console.error("Error fetching users:", err);
           this.errorSignal.set(err.message || "Failed to fetch users");
           this.loadingSignal.set(false);
         },
       });
     }

     addUser(user: User) {
       this.usersSignal.update((users) => [...users, user]);
     }

     deleteUser(userId: number) {
       this.usersSignal.update((users) =>
         users.filter((user) => user.id !== userId)
       );
     }

     toggleUserStatus(userId: number) {
       this.usersSignal.update((users) =>
         users.map((user) =>
           user.id === userId ? { ...user, isActive: !user.isActive } : user
         )
       );
     }
   }
   ```

5. **Использование сервиса с Signals в компонентах**:

   ```typescript
   @Component({
     selector: "app-user-list",
     template: `
       <div *ngIf="userState.loading()">Loading users...</div>
       <div *ngIf="userState.error()">Error: {{ userState.error() }}</div>

       <div>Total users: {{ userState.userCount() }}</div>
       <div>Active users: {{ userState.activeUsers().length }}</div>

       <ul>
         <li *ngFor="let user of userState.users()">
           {{ user.name }} ({{ user.email }}) [{{
             user.isActive ? "Active" : "Inactive"
           }}]
           <button (click)="toggleStatus(user.id)">Toggle Status</button>
           <button (click)="deleteUser(user.id)">Delete</button>
         </li>
       </ul>

       <button (click)="userState.fetchUsers()">Refresh Users</button>
     `,
   })
   export class UserListComponent implements OnInit {
     constructor(public userState: UserStateService) {}

     ngOnInit() {
       this.userState.fetchUsers();
     }

     toggleStatus(userId: number) {
       this.userState.toggleUserStatus(userId);
     }

     deleteUser(userId: number) {
       this.userState.deleteUser(userId);
     }
   }
   ```

6. **Преимущества и передовые практики использования Signals**:

   - **Улучшенная производительность**: Signals обновляют только зависимые части UI, а не всё дерево компонентов
   - **Типобезопасность**: строгая типизация с TypeScript предотвращает ошибки
   - **Прозрачность зависимостей**: явные зависимости между данными и реакциями на их изменения
   - **Интеграция с RxJS**:

   ```typescript
   import { toSignal, toObservable } from "@angular/core/rxjs-interop";

   // Преобразование Observable в Signal
   const users$ = this.http.get<User[]>("/api/users");
   const users = toSignal(users$, { initialValue: [] as User[] });

   // Преобразование Signal в Observable
   const count = signal(0);
   const count$ = toObservable(count);
   count$.subscribe((value) => console.log("Count changed:", value));
   ```

   - **Сигналы vs. NgRx**: для небольших и средних приложений Signals могут заменить NgRx, предоставляя более простой API с меньшим количеством шаблонного кода
   - **Не злоупотребляйте эффектами**: используйте `effect()` экономно, в основном для синхронизации с внешними системами, а не для обновления других сигналов
   - **Сигналы в формах**:

   ```typescript
   @Component({
     template: `
       <form (submit)="submitForm()">
         <input
           [value]="username()"
           (input)="username.set($event.target.value)"
         />
         <p *ngIf="username().length < 3">
           Username must be at least 3 characters
         </p>
         <button type="submit" [disabled]="!isValid()">Submit</button>
       </form>
     `,
   })
   export class SignalFormComponent {
     username = signal("");
     isValid = computed(() => this.username().length >= 3);

     submitForm() {
       console.log("Form submitted with:", this.username());
     }
   }
   ```

   </details>

# Ответы на вопросы о продвинутых темах в Angular

<details>
<summary><b>Что такое DI (Dependency Injection) в Angular, как он работает и примеры использования?</b></summary>

1. **Определение Dependency Injection (DI)** — это паттерн проектирования и механизм в Angular, который позволяет классам получать свои зависимости извне, а не создавать их самостоятельно. DI является основополагающим принципом в архитектуре Angular, делая компоненты более тестируемыми, гибкими и слабо связанными.

2. **Как работает DI в Angular**:

   - В Angular есть иерархическая система инжекторов, которая соответствует дереву компонентов приложения
   - Когда класс запрашивает зависимость, Angular ищет её в текущем инжекторе
   - Если зависимость не найдена, поиск продолжается вверх по иерархии до корневого инжектора
   - Если зависимость найдена, её экземпляр внедряется в класс
   - Если зависимость не найдена нигде, Angular выдаёт ошибку

3. **Ключевые элементы системы DI**:

   ```typescript
   // Провайдер - регистрирует сервис в системе DI
   @Injectable({
     providedIn: "root", // Регистрация на уровне приложения
   })
   export class DataService {
     getData() {
       return ["item1", "item2"];
     }
   }

   // Внедрение через конструктор
   @Component({
     selector: "app-example",
     template: `<div>{{ data.join(", ") }}</div>`,
   })
   export class ExampleComponent {
     data: string[];

     constructor(private dataService: DataService) {
       this.data = this.dataService.getData();
     }
   }

   // Внедрение через функцию inject (Angular 14+)
   @Component({
     selector: "app-modern",
     template: `<div>{{ data.join(", ") }}</div>`,
     standalone: true,
   })
   export class ModernComponent {
     private dataService = inject(DataService);
     data = this.dataService.getData();
   }
   ```

4. **Иерархия провайдеров и области видимости**:

   ```typescript
   // Провайдер корневого уровня (синглтон для всего приложения)
   @Injectable({
     providedIn: "root",
   })
   export class GlobalService {}

   // Провайдер уровня модуля (синглтон для всех компонентов модуля)
   @NgModule({
     providers: [ModuleService],
   })
   export class FeatureModule {}

   // Провайдер уровня компонента (новый экземпляр для компонента и его потомков)
   @Component({
     providers: [LocalService],
   })
   export class ParentComponent {}
   ```

5. **Расширенные возможности DI**:

   ```typescript
   // Использование токенов внедрения
   export const API_URL = new InjectionToken<string>("api.url");

   // Различные типы провайдеров
   @NgModule({
     providers: [
       // Стандартный провайдер класса
       UserService,

       // Расширенные провайдеры
       { provide: UserService, useClass: MockUserService }, // Подмена класса
       { provide: API_URL, useValue: "https://api.example.com" }, // Значение
       { provide: LoggerService, useExisting: ConsoleLoggerService }, // Алиас
       {
         provide: ConfigService,
         useFactory: (http) => {
           return new ConfigService(http, environment.production);
         },
         deps: [HttpClient], // Зависимости для фабрики
       },
     ],
   })
   export class AppModule {}
   ```

   </details>

<details>
<summary><b>Расскажите про хуки жизненного цикла компонента в Angular: зачем они нужны, как работают и порядок их выполнения</b></summary>

1. **Определение и назначение хуков жизненного цикла** — это специальные методы, предоставляемые Angular для выполнения кода в ключевые моменты существования компонента или директивы. Хуки позволяют контролировать поведение компонента при его создании, обновлении и уничтожении, а также реагировать на изменения входных данных и DOM.

2. **Полный порядок выполнения хуков жизненного цикла**:

   - `constructor` — не хук, но первый метод, который вызывается при создании экземпляра компонента
   - `ngOnChanges` — вызывается при изменении входных свойств (`@Input`), включая первоначальную установку значений
   - `ngOnInit` — вызывается один раз после первого `ngOnChanges`, когда компонент и его входные свойства инициализированы
   - `ngDoCheck` — вызывается после `ngOnChanges` и `ngOnInit` и при каждой проверке изменений
   - `ngAfterContentInit` — вызывается один раз после первой проекции контента (ng-content)
   - `ngAfterContentChecked` — вызывается после `ngAfterContentInit` и после каждой проверки проецируемого контента
   - `ngAfterViewInit` — вызывается один раз после инициализации представления компонента и его дочерних компонентов
   - `ngAfterViewChecked` — вызывается после `ngAfterViewInit` и после каждой проверки представления
   - `ngOnDestroy` — вызывается непосредственно перед уничтожением компонента

3. **Реализация и практическое применение хуков**:

   ```typescript
   @Component({
     selector: "app-lifecycle",
     template: `
       <div>Count: {{ count }}</div>
       <button (click)="increment()">Increment</button>
     `,
   })
   export class LifecycleComponent
     implements
       OnInit,
       OnChanges,
       DoCheck,
       AfterContentInit,
       AfterContentChecked,
       AfterViewInit,
       AfterViewChecked,
       OnDestroy
   {
     @Input() initialValue: number = 0;
     count: number;

     constructor() {
       console.log("Constructor called");
       // Используется для внедрения зависимостей, не для инициализации данных
       this.count = 0; // Переменные уже объявлены, но Input еще не установлены
     }

     ngOnChanges(changes: SimpleChanges) {
       console.log("ngOnChanges called", changes);
       // Реагируем на изменения входных свойств
       if (changes["initialValue"]) {
         this.count = this.initialValue;
       }
     }

     ngOnInit() {
       console.log("ngOnInit called");
       // Здесь выполняем инициализацию компонента
       // Все Input уже установлены, можно выполнять HTTP-запросы
     }

     ngDoCheck() {
       console.log("ngDoCheck called");
       // Собственный механизм обнаружения изменений
       // Вызывается очень часто, используйте осторожно!
     }

     ngAfterContentInit() {
       console.log("ngAfterContentInit called");
       // Контент, проецируемый через ng-content, доступен
     }

     ngAfterContentChecked() {
       console.log("ngAfterContentChecked called");
       // Вызывается после каждой проверки проецируемого контента
     }

     ngAfterViewInit() {
       console.log("ngAfterViewInit called");
       // Представление компонента полностью инициализировано
       // Доступны @ViewChild и @ViewChildren
     }

     ngAfterViewChecked() {
       console.log("ngAfterViewChecked called");
       // Вызывается после каждой проверки представления
     }

     ngOnDestroy() {
       console.log("ngOnDestroy called");
       // Очистка ресурсов: отписка от Observable, удаление таймеров
     }

     increment() {
       this.count++;
     }
   }
   ```

4. **Типичные сценарии использования хуков**:

   - `ngOnInit` — получение данных при инициализации, установка подписок на Observable
   - `ngOnChanges` — реагирование на изменение входных параметров, валидация или преобразование входных данных
   - `ngAfterViewInit` — взаимодействие с DOM после его создания, инициализация сторонних библиотек, требующих доступ к DOM
   - `ngOnDestroy` — очистка ресурсов для предотвращения утечек памяти (отписка от Observable, очистка таймеров, слушателей событий)
   - `ngDoCheck` — создание собственных механизмов обнаружения изменений в сложных объектах или массивах

5. **Оптимизация и лучшие практики**:
   - Избегайте тяжелых операций в хуках, которые вызываются часто (`ngDoCheck`, `ngAfterViewChecked`)
   - Всегда реализуйте `ngOnDestroy` для очистки ресурсов
   - Используйте `constructor` только для DI, а `ngOnInit` для инициализации данных
   - Не изменяйте DOM в `ngAfterViewInit` и `ngAfterViewChecked`, т.к. это может вызвать ошибку ExpressionChangedAfterItHasBeenCheckedError
   - Минимизируйте количество хуков, которые реализует компонент — реализуйте только те, которые действительно нужны
   </details>

<details>
<summary><b>Расскажите про Change Detection в Angular и ChangeDetectorRef</b></summary>

1. **Определение Change Detection** — это механизм в Angular, который отслеживает изменения в состоянии приложения и автоматически обновляет DOM для отражения этих изменений. По умолчанию Angular использует стратегию "проверка всего" (CheckAlways), но также поддерживает более производительную стратегию "OnPush".

2. **Как работает Change Detection**:

   - Изменения могут быть вызваны событиями DOM, таймерами, HTTP-запросами и Promise
   - В основе лежит Zone.js, который перехватывает асинхронные операции
   - Когда происходит событие, Angular запускает процесс обнаружения изменений
   - Процесс идёт сверху вниз по дереву компонентов
   - Для каждого компонента сравниваются старые и новые значения свойств
   - При обнаружении изменений, Angular обновляет DOM

3. **Стратегии обнаружения изменений**:

   ```typescript
   // Стратегия Default (CheckAlways)
   @Component({
     selector: "app-default",
     template: `<div>{{ data }}</div>`,
     // Здесь нет явного указания стратегии, поэтому используется Default
   })
   export class DefaultComponent {
     data = "Initial value";

     updateData() {
       this.data = "Updated value"; // Автоматически обновит DOM
     }
   }

   // Стратегия OnPush
   @Component({
     selector: "app-optimized",
     template: `<div>{{ data }}</div>`,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class OptimizedComponent {
     @Input() data: string;

     // CD запустится только при:
     // 1. Изменении ссылки на входной параметр
     // 2. Событии DOM внутри компонента
     // 3. Явном вызове markForCheck() или detectChanges()
     // 4. Использовании async pipe
   }
   ```

4. **ChangeDetectorRef и ручное управление**:

   ```typescript
   @Component({
     selector: "app-manual-cd",
     template: `
       <div>Count: {{ count }}</div>
       <button (click)="increment()">Increment</button>
       <button (click)="detach()">Detach</button>
       <button (click)="reattach()">Reattach</button>
       <button (click)="detectChanges()">Detect Changes</button>
       <button (click)="markForCheck()">Mark For Check</button>
     `,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class ManualCdComponent {
     count = 0;

     constructor(private cdr: ChangeDetectorRef) {}

     increment() {
       this.count++;
       // При OnPush стратегии и отсутствии Input изменений
       // нужно явно вызвать обнаружение изменений
     }

     detach() {
       // Отсоединяет компонент от CD-дерева
       this.cdr.detach();
     }

     reattach() {
       // Присоединяет компонент обратно к CD-дереву
       this.cdr.reattach();
     }

     detectChanges() {
       // Запускает CD локально для этого компонента и его потомков
       // Даже если компонент отсоединен
       this.cdr.detectChanges();
     }

     markForCheck() {
       // Помечает компонент для проверки при следующем CD-цикле
       // Используется с OnPush, чтобы сообщить, что компонент "грязный"
       this.cdr.markForCheck();
     }
   }
   ```

5. **Оптимизация производительности с OnPush**:

   - Используйте иммутабельные объекты и массивы (создавайте новые копии для изменений)
   - Применяйте async pipe для автоматической работы с Observable
   - Используйте событийную модель для общения между компонентами
   - Передавайте простые объекты вместо сложных структур данных
   - Пример оптимизированного компонента:

   ```typescript
   @Component({
     selector: "app-optimized-list",
     template: `
       <div *ngFor="let item of items$ | async; trackBy: trackById">
         {{ item.name }}
       </div>
     `,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class OptimizedListComponent {
     // Используем Observable вместо обычного массива
     items$ = this.dataService.getItems();

     constructor(private dataService: DataService) {}

     trackById(index: number, item: any): number {
       return item.id; // Используем trackBy для оптимизации ngFor
     }
   }
   ```

6. **Signals и новый подход к CD в Angular 16+**:

   ```typescript
   @Component({
     selector: "app-signals",
     template: `
       <div>Count: {{ count() }}</div>
       <div>Double: {{ doubleCount() }}</div>
       <button (click)="increment()">Increment</button>
     `,
   })
   export class SignalsComponent {
     // Сигналы автоматически отслеживают зависимости и обновляют только нужные части UI
     count = signal(0);
     doubleCount = computed(() => this.count() * 2);

     increment() {
       // Обновление сигнала автоматически запускает обновление UI
       this.count.update((value) => value + 1);
     }
   }
   ```

   </details>

   # Ответы на вопросы о компонентах в Angular

<details>
<summary><b>Что такое компоненты в Angular и как они работают?</b></summary>

1. **Определение компонента** — это основной строительный блок Angular-приложения, который инкапсулирует шаблон (HTML-разметку), стили (CSS) и бизнес-логику (TypeScript). Компоненты управляют определённой частью экрана и могут взаимодействовать друг с другом, образуя иерархическую структуру приложения.

2. **Структура компонента** включает три ключевых элемента: шаблон (определяет пользовательский интерфейс), класс (содержит логику, данные и методы) и метаданные (предоставляемые через декоратор `@Component`). Метаданные содержат селектор, ссылки на шаблон и стили, а также другие настройки.

3. **Жизненный цикл компонента** управляется Angular через «хуки жизненного цикла» — специальные методы, которые вызываются в определённые моменты существования компонента: `ngOnInit`, `ngOnChanges`, `ngAfterViewInit`, `ngOnDestroy` и другие. Они позволяют реагировать на изменения и выполнять необходимые действия.

4. **Взаимодействие компонентов** осуществляется через входные параметры (`@Input`), выходные события (`@Output`), сервисы, директивы и другие механизмы. Компоненты могут передавать данные друг другу, образуя родительско-дочерние отношения.

5. **Производительность компонентов** оптимизируется с помощью механизма обнаружения изменений (Change Detection). В Angular 17+ рекомендуется использовать сигналы (Signals) вместо традиционных Observable и Zone.js для более эффективного отслеживания изменений и обновления представления.
</details>

<details>
<summary><b>Как передавать данные между компонентами в Angular?</b></summary>

1. **@Input / @Output** — основной механизм для передачи данных между родительским и дочерним компонентами. `@Input` позволяет передавать данные от родителя к ребёнку, а `@Output` с `EventEmitter` используется для отправки событий от ребёнка к родителю:

   ```typescript
   // Дочерний компонент
   @Input() data: string;
   @Output() dataChanged = new EventEmitter<string>();

   // Родительский шаблон
   <app-child [data]="parentData" (dataChanged)="handleDataChange($event)"></app-child>
   ```

2. **Сервисы и инъекция зависимостей** — для обмена данными между компонентами, не связанными напрямую. Сервис создаёт общее хранилище данных, доступное через инъекцию. В современном Angular можно использовать сигналы для реактивного обновления:

   ```typescript
   @Injectable({ providedIn: "root" })
   export class DataService {
     public data = signal("initial value");
     updateData(newValue: string) {
       this.data.set(newValue);
     }
   }
   ```

3. **ViewChild / ContentChild** — для доступа к дочерним компонентам и их методам/свойствам из родительского компонента:

   ```typescript
   @ViewChild(ChildComponent) childComponent: ChildComponent;

   ngAfterViewInit() {
     this.childComponent.someMethod();
   }
   ```

4. **Маршрутизация и параметры маршрута** — для передачи данных между компонентами на разных страницах:

   ```typescript
   // Навигация с параметрами
   this.router.navigate(["/details", itemId], {
     queryParams: { filter: "active" },
   });

   // Получение параметров
   this.route.params.subscribe((params) => {
     this.itemId = params["id"];
   });
   ```

5. **Состояние приложения** — использование библиотек управления состоянием (NgRx, NGXS, Akita) для создания централизованного хранилища данных:
   ```typescript
   // NgRx
   this.store.dispatch(new AddItemAction(newItem));
   this.items$ = this.store.select((state) => state.items);
   ```
   </details>

<details>
<summary><b>Что такое standalone компоненты в Angular?</b></summary>

1. **Определение standalone компонентов** — это компоненты, директивы или пайпы, которые не требуют объявления в NgModule. Они могут работать самостоятельно благодаря свойству `standalone: true` в декораторе и явному импорту всех зависимостей. Появились в Angular 14 и стали рекомендованным подходом в Angular 17+.

2. **Преимущества standalone компонентов**:

   - Сокращение шаблонного кода — не нужно создавать и поддерживать дополнительные NgModule
   - Более прозрачные зависимости — все зависимости явно указаны в массиве `imports`
   - Улучшенный tree-shaking — компоненты включают только необходимые зависимости
   - Упрощённое тестирование — компоненты проще изолировать и тестировать
   - Более понятная модульность — легче определить, что компонент использует

3. **Создание standalone компонента**:

   ```typescript
   @Component({
     selector: "app-user-profile",
     templateUrl: "./user-profile.component.html",
     standalone: true,
     imports: [CommonModule, RouterModule, UserAvatarComponent],
   })
   export class UserProfileComponent {
     // Логика компонента
   }
   ```

4. **Миграция на standalone компоненты** подразумевает:

   - Добавление `standalone: true` в декоратор компонента
   - Перенос зависимостей из NgModule в массив `imports` компонента
   - Удаление избыточных NgModule или их преобразование в маршрутизацию

5. **Маршрутизация со standalone компонентами** использует прямое указание компонентов вместо загрузки модулей:
   ```typescript
   const routes: Routes = [
     {
       path: "users",
       component: UsersComponent,
       providers: [UsersService],
     },
     {
       path: "admin",
       loadComponent: () =>
         import("./admin/admin.component").then((m) => m.AdminComponent),
     },
   ];
   ```
   </details>

<details>
<summary><b>Что такое Signals в Angular и как они улучшают работу с состоянием?</b></summary>

1. **Определение Signals** — это новый реактивный примитив в Angular (добавленный в версии 16), который представляет значение, изменяющееся со временем. Сигналы автоматически отслеживают зависимости и оптимизируют обновление пользовательского интерфейса. Они являются альтернативой использованию Zone.js для отслеживания изменений и стали основным подходом в Angular 17+.

2. **Основные типы сигналов**:

   - **Сигналы чтения-записи** — создаются функцией `signal()` и могут изменяться:
     ```typescript
     const count = signal(0); // Создание сигнала
     count.set(1); // Установка нового значения
     count.update((v) => v + 1); // Обновление на основе предыдущего значения
     ```
   - **Вычисляемые сигналы** — создаются функцией `computed()` и зависят от других сигналов:
     ```typescript
     const count = signal(0);
     const doubleCount = computed(() => count() * 2);
     ```
   - **Эффекты** — выполняют побочные эффекты при изменении сигналов:
     ```typescript
     effect(() => {
       console.log(`Значение изменилось: ${count()}`);
     });
     ```

3. **Преимущества сигналов** по сравнению с традиционными подходами:

   - Более точное отслеживание изменений — обновляются только зависимые части UI
   - Меньшая зависимость от Zone.js — снижение накладных расходов
   - Улучшенная типизация — лучшая поддержка TypeScript
   - Явные зависимости — более понятный код и поток данных
   - Повышенная производительность — особенно в больших приложениях

4. **Применение в компонентах**:

   ```typescript
   @Component({
     selector: "app-counter",
     template: `
       <p>Счётчик: {{ count() }}</p>
       <p>Удвоенный счётчик: {{ doubleCount() }}</p>
       <button (click)="increment()">+</button>
     `,
   })
   export class CounterComponent {
     count = signal(0);
     doubleCount = computed(() => this.count() * 2);

     increment() {
       this.count.update((v) => v + 1);
     }
   }
   ```

5. **Интеграция с существующим кодом** — сигналы можно легко использовать с RxJS и другими реактивными подходами:

   ```typescript
   // Преобразование Observable в сигнал
   const users = toSignal(this.userService.getUsers(), { initialValue: [] });

   // Преобразование сигнала в Observable
   const count$ = toObservable(this.count);
   ```

   </details>

<details>
<summary><b>Каковы основные методы жизненного цикла компонента Angular?</b></summary>

1. **ngOnChanges** — вызывается при изменении входных свойств компонента, помеченных декоратором `@Input()`. Получает объект `SimpleChanges`, содержащий текущие и предыдущие значения свойств:

   ```typescript
   ngOnChanges(changes: SimpleChanges) {
     if (changes['userData'] && !changes['userData'].firstChange) {
       this.processUserData(changes['userData'].currentValue);
     }
   }
   ```

2. **ngOnInit** — вызывается один раз после первой проверки изменений свойств и инициализации директив. Идеальное место для начальной настройки компонента, запросов данных и подписок:

   ```typescript
   ngOnInit() {
     this.subscription = this.dataService.getData().subscribe(
       data => this.data = data
     );
   }
   ```

3. **ngDoCheck** — вызывается при каждой проверке изменений, позволяя реализовать собственную логику обнаружения изменений. Требует осторожного использования из-за частого вызова:

   ```typescript
   ngDoCheck() {
     if (this.previousValue !== JSON.stringify(this.complexObject)) {
       this.previousValue = JSON.stringify(this.complexObject);
       this.processChanges();
     }
   }
   ```

4. **ngAfterViewInit** — вызывается после инициализации представления компонента и его дочерних компонентов. В этот момент становятся доступны элементы, полученные через `@ViewChild` и `@ViewChildren`:

   ```typescript
   ngAfterViewInit() {
     // Доступ к дочерним элементам
     this.childComponent.someMethod();
     this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'blue');
   }
   ```

5. **ngOnDestroy** — вызывается непосредственно перед уничтожением компонента. Используется для очистки ресурсов: отмены подписок, остановки таймеров и освобождения ссылок для предотвращения утечек памяти:
   ```typescript
   ngOnDestroy() {
     // Отмена подписок для предотвращения утечек памяти
     this.subscription.unsubscribe();
     clearInterval(this.intervalId);
     this.eventManager.removeGlobalEventListener(this.listenerRef);
   }
   ```
   </details>

##### Базовые вопросы для Junior/Middle

<details>
<summary>1. В чем отличие фреймворка от библиотеки?</summary>

Основное отличие фреймворка от библиотеки заключается в инверсии управления. При использовании библиотеки вы сами вызываете ее функции, когда это необходимо (вы контролируете поток выполнения). При работе с фреймворком, наоборот, фреймворк контролирует поток выполнения программы и вызывает ваш код в определенные моменты (принцип "Hollywood" - "не звоните нам, мы позвоним вам").

Другие отличия:

- Фреймворк обычно предоставляет целостный набор инструментов для разработки (как Angular), включая структуру приложения, роутинг, управление состоянием и т.д.
- Библиотека предоставляет набор функций или компонентов для решения конкретных задач (как например, Lodash или Moment.js).
- Фреймворки требуют следования определенной архитектуре и соглашениям, в то время как библиотеки более гибкие в использовании.
- Переход с одного фреймворка на другой обычно требует значительного переписывания кода, в то время как замена библиотеки обычно проще.
</details>

<details>
<summary>2. Какие популярные CSS, JS библиотеки вы знаете?</summary>

**JavaScript библиотеки:**

- **jQuery** - одна из самых известных библиотек для упрощения работы с DOM, AJAX и т.д.
- **Lodash/Underscore** - предоставляют множество утилит для работы с массивами, объектами, функциями.
- **Moment.js/date-fns** - для удобной работы с датами и временем.
- **Axios** - для выполнения HTTP-запросов.
- **RxJS** - библиотека для реактивного программирования.

**CSS библиотеки и фреймворки:**

- **Bootstrap** - популярный CSS-фреймворк для создания адаптивных интерфейсов.
- **Tailwind CSS** - утилитарный CSS-фреймворк для создания кастомизированных дизайнов.
- **Material UI** - реализация Material Design от Google.
- **Bulma** - современный CSS-фреймворк на основе Flexbox.
- **SASS/SCSS, Less** - препроцессоры CSS, расширяющие возможности стилей.

**Для Angular:**

- **Angular Material** - официальная библиотека компонентов Material Design для Angular.
- **PrimeNG** - богатая коллекция UI-компонентов для Angular.
- **NG-Bootstrap** - Bootstrap компоненты для Angular.
- **NgRx** - библиотека для управления состоянием приложения на основе Redux.
- **Angular Flex Layout** - для создания адаптивных макетов.
</details>

<details>
<summary>Знаете ли вы как браузер обрабатывает index.html (расскажите про Critical Rendering Path)?</summary>
<div>
Процесс обработки HTML-документа браузером происходит в несколько этапов:

1. **Получение HTML-документа**: Браузер делает HTTP-запрос к серверу и получает ответ, содержащий HTML-документ.

2. **Парсинг HTML**: Браузер анализирует HTML и строит DOM (Document Object Model) - древовидное представление документа в памяти.

   - При обнаружении CSS-файлов (в тегах `<link>` или `<style>`) начинается их загрузка и обработка.
   - При обнаружении JavaScript (в тегах `<script>`) - загрузка и выполнение скриптов (если нет атрибутов `async` или `defer`).

3. **Построение CSSOM**: На основе CSS строится CSSOM (CSS Object Model).

4. **Построение дерева рендеринга (Render Tree)**: Комбинирование DOM и CSSOM для создания дерева рендеринга, которое содержит только видимые элементы.

5. **Layout (Reflow)**: Расчет размеров и позиций для всех элементов на странице.

6. **Paint**: Отрисовка пикселей на экране.

7. **Compositing**: Объединение слоев в финальное изображение, которое пользователь видит на экране.

При наличии JavaScript, который модифицирует DOM или CSSOM, могут происходить повторные этапы Layout и Paint, что влияет на производительность приложения.

</div>
</details>

<details>
<summary>Какие типы данных есть в JavaScript?</summary>
<div>
В JavaScript есть два основных типа данных: примитивные и ссылочные (объекты).

**Примитивные типы данных:**

1. **Number** - представляет как целые, так и числа с плавающей точкой (например, 42 или 3.14)
2. **String** - последовательность символов, заключенная в одинарные или двойные кавычки ('текст' или "текст")
3. **Boolean** - логический тип с двумя значениями: true и false
4. **Undefined** - специальное значение, которое имеет переменная, объявленная, но не инициализированная
5. **Null** - специальное значение, представляющее "отсутствие значения"
6. **Symbol** (добавлен в ES6) - уникальный и неизменяемый примитивный тип данных
7. **BigInt** (добавлен в ES2020) - для представления целых чисел произвольной длины

**Ссылочные типы данных (все они являются объектами):**

1. **Object** - базовый тип для всех объектов
2. **Array** - упорядоченная коллекция элементов
3. **Function** - объект, который может быть вызван
4. **Date** - для работы с датами и временем
5. **RegExp** - для работы с регулярными выражениями
6. **Map, Set, WeakMap, WeakSet** - коллекции данных
7. **Promise** - для асинхронных операций

Для проверки типа данных используется оператор `typeof`, который возвращает строку с именем типа. Однако стоит отметить, что `typeof null` возвращает 'object', что считается историческим багом JavaScript.

</div>
</details>

<details>
<summary>Как устроена память в JavaScript (memory heap, memory stack)?</summary>
<div>
JavaScript использует автоматическое управление памятью с помощью сборщика мусора. Память в JavaScript организована следующим образом:

1. **Стек (Stack)** - используется для хранения:

   - Примитивных типов данных (number, string, boolean и т.д.)
   - Ссылок на объекты, находящиеся в куче
   - Информации о вызовах функций (call stack)

2. **Куча (Heap)** - используется для хранения:

   - Объектов (Object, Array, Function и т.д.)
   - Динамически выделяемой памяти

3. **Сборка мусора** - процесс автоматического освобождения памяти, занятой объектами, которые больше не нужны.
   JavaScript использует алгоритм "сборки мусора по достижимости", который работает так:

   - Определяются "корни" (глобальные переменные, переменные в стеке и т.д.)
   - Помечаются как "живые" все объекты, достижимые из этих корней
   - Объекты, не помеченные как "живые", собираются и память освобождается

4. **Утечки памяти** - ситуации, когда память не освобождается, хотя объекты больше не нужны. Основные причины:
   - Циклические ссылки (особенно в замыканиях)
   - Забытые обработчики событий
   - Ссылки на DOM-элементы, которые были удалены из документа

В JavaScript разработчик не может напрямую управлять выделением и освобождением памяти, но должен понимать механизмы работы с памятью, чтобы избегать утечек и оптимизировать использование ресурсов.

</div>
</details>

<details>
<summary>Что такое this и расскажите про область видимости?</summary>
<div>
**this** в JavaScript - это ключевое слово, которое ссылается на контекст выполнения функции. Значение `this` определяется не во время объявления функции, а во время её вызова и зависит от способа вызова:

1. **В глобальном контексте** - `this` указывает на глобальный объект (в браузере - `window`, в Node.js - `global`)
2. **В методе объекта** - `this` указывает на этот объект
3. **При вызове функции с `new`** - `this` указывает на вновь созданный экземпляр объекта
4. **При использовании методов `call()`, `apply()` или `bind()`** - `this` принимает значение первого аргумента этих методов
5. **В стрелочных функциях** - `this` лексически наследуется из окружающего контекста, где функция была определена

**Область видимости (Scope)** определяет доступность переменных в определенных частях кода:

1. **Глобальная область видимости** - переменные, объявленные вне любой функции, доступны в любой части программы
2. **Функциональная область видимости** - переменные, объявленные внутри функции, доступны только внутри этой функции
3. **Блочная область видимости** - переменные, объявленные с `let` и `const`, имеют область видимости в пределах блока (между `{` и `}`)
4. **Лексическая область видимости** - вложенные функции имеют доступ к переменным из внешних функций (замыкание)

В TypeScript и современном JavaScript области видимости становятся более строгими и предсказуемыми, что помогает избегать многих ошибок, связанных с `this` и областями видимости.

</div>
</details>

<details>
<summary>В чем отличие var от const, let?</summary>
<div>
Ключевые отличия между `var`, `let` и `const` в JavaScript:

**Область видимости:**

- `var` имеет функциональную область видимости - переменная доступна внутри всей функции, где она объявлена
- `let` и `const` имеют блочную область видимости - переменные доступны только внутри блока (между `{` и `}`), где они объявлены

**Подъем (hoisting):**

- `var` поднимается (hoisted) к началу функции с начальным значением `undefined`
- `let` и `const` также поднимаются, но находятся в "временной мертвой зоне" (TDZ) до момента их объявления, обращение к ним вызывает ошибку

**Переопределение:**

- `var` можно переопределить в той же области видимости без ошибки
- `let` также можно переопределить значение
- `const` нельзя переопределить после инициализации (значение константы не может быть изменено)

**Инициализация:**

- `var` и `let` можно объявить без начального значения (`var x;`, `let y;`)
- `const` требует инициализации при объявлении (`const z = 5;`)

**Глобальный объект:**

- `var`, объявленный в глобальной области, создает свойство в глобальном объекте (`window` в браузере)
- `let` и `const` не создают свойств в глобальном объекте

**Важно:** Для объектов и массивов, объявленных с `const`, нельзя переназначить ссылку, но можно изменять внутреннее содержимое (`const obj = {}; obj.prop = 1;` - это допустимо).

</div>
</details>

<details>
<summary>Объясните, как работает наследование прототипов, что такое цепочка прототипов, и когда появилось ключевое слова class в JS?</summary>
<div>
**Наследование прототипов** - это механизм, позволяющий объектам в JavaScript наследовать свойства и методы от других объектов.

**Основные концепции:**

1. **Прототип объекта** - каждый объект в JavaScript имеет свойство `[[Prototype]]` (внутреннее свойство, доступное через `Object.getPrototypeOf()` или через устаревший `__proto__`), которое указывает на другой объект - его прототип.

2. **Цепочка прототипов** - если свойство не найдено в самом объекте, JavaScript ищет его в прототипе объекта, затем в прототипе прототипа и так далее, формируя "цепочку прототипов", которая заканчивается `Object.prototype`, прототипом которого является `null`.

3. **Создание объектов с заданным прототипом**:

   - Использование конструкторов с `new`: `function Person() {} const person = new Person();`
   - `Object.create()`: `const child = Object.create(parent);`
   - Использование классов (ES6+): `class Child extends Parent {}`

4. **Свойство constructor** - каждая функция-конструктор имеет свойство `prototype`, в котором есть свойство `constructor`, указывающее обратно на функцию-конструктор.

**Пример работы:**

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function () {
  console.log(this.name);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Установка цепочки прототипов
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Восстанавливаем свойство constructor

Dog.prototype.bark = function () {
  console.log("Woof!");
};

const dog = new Dog("Rex", "German Shepherd");
dog.sayName(); // "Rex" - метод унаследован от Animal.prototype
dog.bark(); // "Woof!" - метод из Dog.prototype
```

В современном JavaScript можно использовать классы (синтаксический сахар над прототипным наследованием):

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log("Woof!");
  }
}
```

</div>
</details>

<details>
<summary>Что такое структура данных и какие виды вы знаете (Стек, etc)?</summary>
<div>
**Структура данных** - это способ организации и хранения данных для эффективного доступа и изменения. Выбор структуры данных зависит от задачи, требований к производительности и характера операций.

**Основные структуры данных:**

1. **Примитивные структуры:**

   - **Массив (Array)** - последовательность элементов, доступных по индексу
   - **Строка (String)** - последовательность символов
   - **Число (Number)** - представление числовых значений

2. **Линейные структуры:**

   - **Связный список (Linked List)** - элементы хранятся не последовательно, а каждый элемент содержит указатель на следующий
   - **Стек (Stack)** - коллекция с принципом LIFO (Last In, First Out)
   - **Очередь (Queue)** - коллекция с принципом FIFO (First In, First Out)
   - **Дек (Deque)** - двусторонняя очередь, элементы могут добавляться и удаляться с обоих концов

3. **Нелинейные структуры:**

   - **Дерево (Tree)** - иерархическая структура, где каждый элемент (узел) имеет 0 или более потомков
     - **Двоичное дерево (Binary Tree)** - каждый узел имеет максимум двух потомков
     - **Двоичное дерево поиска (BST)** - упорядоченное дерево для быстрого поиска
     - **Куча (Heap)** - специальное дерево для быстрого доступа к минимальному/максимальному элементу
   - **Граф (Graph)** - набор вершин и соединяющих их рёбер
   - **Хеш-таблица (Hash Table)** - структура для хранения пар ключ-значение с быстрым доступом по ключу

4. **Продвинутые структуры:**
   - **Префиксное дерево (Trie)** - для эффективного поиска строк
   - **B-дерево и B+-дерево** - для баз данных и файловых систем
   - **Сегментное дерево (Segment Tree)** - для эффективного выполнения операций на отрезках
   - **Система непересекающихся множеств (Disjoint Set)** - для группировки элементов

**В JavaScript и TypeScript доступны:**

- Встроенные: Array, Object, Map, Set, WeakMap, WeakSet
- Реализуемые на их основе: Queue, Stack, LinkedList, Tree, Graph и другие

В Angular и других современных фреймворках понимание структур данных особенно важно для оптимизации производительности и управления состоянием приложения.

</div>
</details>

<details>
<summary>Что такое Promise и для чего используется в JS?</summary>
<div>
**Promise** - это объект в JavaScript, представляющий результат асинхронной операции, который может находиться в одном из трёх состояний:

- **Pending** (ожидание) - начальное состояние, операция ещё не завершена
- **Fulfilled** (выполнено) - операция успешно завершена
- **Rejected** (отклонено) - операция завершилась с ошибкой

**Для чего используются Promise:**

1. **Управление асинхронным кодом** - Promise позволяет писать более читаемый и поддерживаемый асинхронный код, избегая "callback hell" (вложенных callback-функций).

2. **Обработка ошибок** - унифицированный механизм обработки ошибок с помощью метода `.catch()`.

3. **Цепочки вызовов** - возможность строить цепочки асинхронных операций с помощью `.then()`.

4. **Композиция** - объединение нескольких асинхронных операций с помощью `Promise.all()`, `Promise.race()`, `Promise.allSettled()` и `Promise.any()`.

5. **Основа для async/await** - синтаксис `async/await` работает на основе Promise, делая асинхронный код похожим на синхронный.

**Основные методы Promise API:**

```javascript
// Создание Promise
const promise = new Promise((resolve, reject) => {
  // Асинхронный код
  if (успех) {
    resolve(результат);
  } else {
    reject(ошибка);
  }
});

// Использование Promise
promise
  .then((результат) => {
    // Обработка успешного результата
    return новыйРезультат; // можно вернуть значение или новый Promise
  })
  .catch((ошибка) => {
    // Обработка ошибки
  })
  .finally(() => {
    // Код, который выполняется в любом случае
  });

// Статические методы
Promise.all([promise1, promise2]); // Выполняется, когда все Promise выполнены, или прерывается при первой ошибке
Promise.race([promise1, promise2]); // Выполняется, когда выполнен первый Promise (успешно или с ошибкой)
Promise.allSettled([promise1, promise2]); // Ждет завершения всех Promise, независимо от результата
Promise.any([promise1, promise2]); // Выполняется при первом успешном Promise, или со всеми ошибками
```

В Angular Promise широко используются для HTTP-запросов (хотя чаще используются Observable из RxJS), работы с данными и управления асинхронными операциями.

</div>
</details>

<details>
<summary>Что такое call-stack, task-queue (приведите примеры работы)?</summary>
<div>
 **Call Stack (стек вызовов)** - это структура данных, работающая по принципу LIFO (Last In, First Out), которая отслеживает выполнение функций в JavaScript. Когда вызывается функция, она добавляется в вершину стека вызовов, и когда функция завершает выполнение, она удаляется из стека.

**Основные характеристики Call Stack:**

- Однопоточный - JavaScript может выполнять только одну операцию за раз
- Синхронный - код выполняется последовательно
- Блокирующий - длительные операции блокируют стек, ничего другого не может выполняться
- Имеет ограниченный размер, что может привести к ошибке "Maximum call stack size exceeded" при бесконечной рекурсии

**Task Queue (очередь задач)** - это структура данных, работающая по принципу FIFO (First In, First Out), содержащая задачи (callback-функции), которые ожидают выполнения, когда стек вызовов освободится.

**Event Loop (цикл событий)** - это механизм, который связывает стек вызовов и очередь задач:

1. Проверяет, пуст ли стек вызовов
2. Если стек пуст, берет первую задачу из очереди и помещает ее в стек для выполнения
3. Повторяет этот процесс

**Типы очередей задач:**

1. **Macrotask Queue (очередь макрозадач)** - содержит задачи от:

   - setTimeout, setInterval
   - обработчиков событий DOM
   - I/O операций
   - requestAnimationFrame и др.

2. **Microtask Queue (очередь микрозадач)** - обрабатывается после каждой макрозадачи, до рендеринга, содержит:
   - Promise callbacks (.then, .catch, .finally)
   - queueMicrotask
   - MutationObserver callbacks
   - process.nextTick (в Node.js)

Понимание устройства стека вызовов и очереди задач важно для правильного написания асинхронного кода в Angular и избежания блокировки пользовательского интерфейса при выполнении длительных операций.

</div>
</details>

<details>
<summary>Что такое макро и микро задачи в JS?</summary>
<div>
 **Макрозадачи (Macrotasks)** и **микрозадачи (Microtasks)** - это два типа асинхронных задач в JavaScript, которые обрабатываются event loop (циклом событий) по-разному.

**Макрозадачи (Macrotasks):**

- Выполняются по одной за итерацию event loop
- После выполнения макрозадачи происходит рендеринг UI (обновление DOM)
- Примеры макрозадач:
  - setTimeout, setInterval
  - requestAnimationFrame
  - setImmediate (Node.js)
  - Обработчики событий UI (click, keydown и т.д.)
  - I/O операции (Network, File System)

**Микрозадачи (Microtasks):**

- Выполняются все сразу после текущей макрозадачи, до следующей макрозадачи и до рендеринга
- Могут создавать новые микрозадачи, которые также будут выполнены в текущем "микрозадачном цикле"
- Примеры микрозадач:
  - Promise callbacks (.then(), .catch(), .finally())
  - queueMicrotask()
  - process.nextTick (Node.js, имеет более высокий приоритет)
  - MutationObserver

**Порядок выполнения в Event Loop:**

1. Выполнить все синхронные операции в стеке вызовов
2. Из очереди макрозадач взять и выполнить одну задачу
3. Выполнить все микрозадачи из очереди микрозадач, включая те, которые добавляются во время обработки
4. Обновить рендеринг, если необходимо
5. Вернуться к шагу 2

**Пример:**

```javascript
console.log("1 - синхронный код");

setTimeout(() => {
  console.log("2 - макрозадача");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - микрозадача");
});

console.log("4 - синхронный код");

// Вывод будет:
// 1 - синхронный код
// 4 - синхронный код
// 3 - микрозадача
// 2 - макрозадача
```

В Angular понимание макро- и микрозадач особенно важно при работе с асинхронными операциями, обновлениями UI и оптимизацией производительности, особенно в контексте зоны выполнения Angular (NgZone) и обнаружения изменений (change detection).

</div>
</details>

<details>
<summary>Назовите основные принципы ООП?</summary>
<div>
**Объектно-ориентированное программирование (ООП)** - это парадигма программирования, основанная на концепции "объектов", которые содержат данные и код. Основные принципы ООП:

**1. Инкапсуляция (Encapsulation)**

- Объединение данных (свойств) и методов, которые работают с этими данными, в единую сущность - класс
- Скрытие внутренней реализации и предоставление интерфейса для взаимодействия с объектом
- Контроль доступа к свойствам и методам через модификаторы доступа (public, private, protected)

**Пример в TypeScript:**

```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  public getBalance(): number {
    return this.balance;
  }
}
```

**2. Наследование (Inheritance)**

- Возможность создавать новые классы на основе существующих
- Повторное использование кода и создание иерархии классов
- Дочерние классы наследуют свойства и методы родительских классов

**Пример:**

```typescript
class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(initialBalance: number, interestRate: number) {
    super(initialBalance);
    this.interestRate = interestRate;
  }

  public addInterest(): void {
    const interest = (this.getBalance() * this.interestRate) / 100;
    this.deposit(interest);
  }
}
```

**3. Полиморфизм (Polymorphism)**

- Возможность использовать объекты разных типов через общий интерфейс
- Переопределение методов в дочерних классах с сохранением сигнатуры
- Использование одного и того же имени метода с разной реализацией в разных классах

**Пример:**

```typescript
interface Shape {
  calculateArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

function printArea(shape: Shape): void {
  console.log(`Площадь: ${shape.calculateArea()}`);
}

printArea(new Circle(5)); // Работает с объектом Circle
printArea(new Rectangle(4, 6)); // Работает с объектом Rectangle
```

**4. Абстракция (Abstraction)**

- Выделение существенных характеристик объекта, игнорирование несущественных
- Создание простых, понятных интерфейсов для сложных систем
- Использование абстрактных классов и интерфейсов для определения шаблонов

**Пример:**

```typescript
abstract class Vehicle {
  constructor(protected make: string, protected model: string) {}

  abstract start(): void;
  abstract stop(): void;

  getInfo(): string {
    return `${this.make} ${this.model}`;
  }
}

class Car extends Vehicle {
  start(): void {
    console.log("Автомобиль заведен");
  }

  stop(): void {
    console.log("Автомобиль остановлен");
  }
}
```

В Angular активно применяются принципы ООП:

- Компоненты, сервисы, директивы - это классы с четко определенными методами и свойствами (инкапсуляция)
- Использование наследования для создания базовых классов и их расширения
- Применение интерфейсов для определения контрактов (полиморфизм)
- Абстракция в виде сервисов, скрывающих сложную логику работы с данными
</div>
</details>

<details>
<summary>Что такое класс и интерфейс?</summary>
<div>
**Классы** и **интерфейсы** - это ключевые концепции в объектно-ориентированном программировании, особенно в TypeScript, который используется в Angular.

**Класс (Class):**

- Это "чертёж" для создания объектов
- Определяет структуру данных (свойства) и поведение (методы)
- Может иметь конструктор для инициализации объектов
- Поддерживает наследование, инкапсуляцию и полиморфизм
- Может быть инстанциирован с помощью оператора `new`

**Пример класса в TypeScript:**

```typescript
class User {
  // Свойства
  private id: number;
  public name: string;
  protected email: string;

  // Конструктор
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  // Методы
  public getInfo(): string {
    return `User ${this.name} (ID: ${this.id})`;
  }

  // Геттер
  get userId(): number {
    return this.id;
  }

  // Статический метод
  static createGuest(): User {
    return new User(0, "Guest", "guest@example.com");
  }
}

// Использование
const user = new User(1, "Иван", "ivan@example.com");
console.log(user.getInfo());
```

**Интерфейс (Interface):**

- Определяет "контракт", которому должны соответствовать объекты
- Содержит только объявления свойств и методов, без реализации
- Не может быть инстанциирован напрямую
- Используется для типизации и определения формы объектов
- Может расширять другие интерфейсы
- Существует только во время компиляции, не генерирует JavaScript-код

**Пример интерфейса в TypeScript:**

```typescript
interface IUser {
  id: number;
  name: string;
  email: string;
  getInfo(): string;
}

interface IEmployee extends IUser {
  position: string;
  department: string;
  salary: number;
}

// Реализация интерфейса классом
class Employee implements IEmployee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;

  constructor(props: IEmployee) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.position = props.position;
    this.department = props.department;
    this.salary = props.salary;
  }

  getInfo(): string {
    return `${this.name}, ${this.position} in ${this.department}`;
  }
}

// Типизация переменных интерфейсами
function processUser(user: IUser): void {
  console.log(user.getInfo());
}

// Объект, соответствующий интерфейсу, без явного класса
const manager: IUser = {
  id: 2,
  name: "Мария",
  email: "maria@example.com",
  getInfo: function () {
    return `Менеджер ${this.name}`;
  },
};
```

**Ключевые отличия между классами и интерфейсами:**

1. **Реализация:**

   - Классы содержат как объявления, так и реализацию свойств и методов
   - Интерфейсы содержат только объявления без реализации

2. **Инстанцирование:**

   - Классы могут создавать экземпляры объектов
   - Интерфейсы не могут быть инстанцированы

3. **Компиляция:**

   - Классы компилируются в JavaScript-код
   - Интерфейсы существуют только на этапе компиляции TypeScript и не генерируют JavaScript-код

4. **Наследование:**
   - Класс может наследовать только один класс, но может реализовывать множество интерфейсов
   - Интерфейс может расширять несколько интерфейсов

В Angular классы используются для создания компонентов, сервисов, директив и пайпов, а интерфейсы применяются для типизации данных, определения контрактов и улучшения кодовой базы.

</div>
</details>

<details>
<summary>Что такое конструктор класса?</summary>
<div>
**Конструктор класса** - это специальный метод, который вызывается при создании экземпляра класса (при использовании оператора `new`). Конструктор используется для инициализации свойств объекта и выполнения любой необходимой настройки.

**Основные характеристики конструктора:**

1. **Имя метода:** всегда `constructor`
2. **Уникальность:** класс может иметь только один конструктор
3. **Вызов:** происходит автоматически при создании экземпляра класса
4. **Отсутствие возвращаемого значения:** конструктор не возвращает значение явно

**Примеры конструкторов в TypeScript:**

**Базовый конструктор:**

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person("Иван", 30);
```

**Сокращенная инициализация параметров:**

```typescript
class Person {
  // TypeScript позволяет сокращенную запись для инициализации свойств через параметры конструктора
  constructor(public name: string, public age: number) {
    // Здесь не нужно писать this.name = name и this.age = age
    // Модификаторы доступа в параметрах автоматически создают и инициализируют соответствующие свойства
  }
}
```

**Конструктор в наследовании:**

```typescript
class Animal {
  constructor(public name: string) {}

  makeSound(): void {
    console.log("Звук животного");
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    // Вызов конструктора родительского класса через super
    super(name);
    // Инициализация собственных свойств
  }

  makeSound(): void {
    console.log("Гав-гав!");
  }
}

const dog = new Dog("Рекс", "Немецкая овчарка");
```

**Конструктор с необязательными параметрами:**

```typescript
class Configuration {
  name: string;
  timeout: number;
  retries: number;

  constructor(name: string, options?: { timeout?: number; retries?: number }) {
    this.name = name;
    this.timeout = options?.timeout ?? 30000; // значение по умолчанию
    this.retries = options?.retries ?? 3; // значение по умолчанию
  }
}

const config1 = new Configuration("API Client");
const config2 = new Configuration("Database", { timeout: 5000 });
```

**Приватный конструктор для шаблона Singleton:**

```typescript
class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  public static getInstance(connectionString: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(connectionString);
    }
    return Database.instance;
  }

  connect(): void {
    console.log(`Подключение к ${this.connectionString}`);
  }
}

// Нельзя создать экземпляр напрямую: const db = new Database();
const db = Database.getInstance("mongodb://localhost:27017");
```

**В Angular конструкторы активно используются:**

- Для внедрения зависимостей через механизм Dependency Injection
- Для инициализации компонентов, сервисов, директив и пайпов
- Для установки начальных значений свойств

**Пример конструктора Angular-компонента:**

```typescript
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // В конструкторе обычно только внедряют зависимости
    // и выполняют простую инициализацию
  }

  ngOnInit(): void {
    // Сложная инициализация обычно переносится в ngOnInit
    this.route.params.subscribe((params) => {
      const userId = params["id"];
      this.userService.getUser(userId).subscribe((user) => {
        this.user = user;
      });
    });
  }
}
```

</div>
</details>

<details>
<summary>Расскажите про стек TCP/IP, а также более подробно про, что такое HTTP и какую роль он играет при разработке приложений?</summary>
<div>
  **Стек протоколов TCP/IP** (или Интернет-протокол) - это набор сетевых протоколов, которые обеспечивают связь между компьютерами в сети Интернет. Это основа, на которой построена вся современная сетевая коммуникация, включая веб-приложения, разрабатываемые на Angular.

**Стек TCP/IP состоит из 4 уровней:**

1. **Уровень сетевого интерфейса (Link Layer)**

   - Самый нижний уровень, отвечает за физическую передачу данных
   - Включает такие протоколы как Ethernet, Wi-Fi (IEEE 802.11), PPP
   - Работает с физическими адресами устройств (MAC-адреса)
   - Отвечает за передачу данных в пределах локальной сети

2. **Сетевой уровень / Интернет-уровень (Internet Layer)**

   - Обеспечивает маршрутизацию пакетов между различными сетями
   - Основной протокол – IP (Internet Protocol)
     - IPv4 – использует 32-битные адреса (например, 192.168.1.1)
     - IPv6 – использует 128-битные адреса для решения проблемы нехватки адресов
   - Другие протоколы этого уровня: ICMP (для диагностики), ARP (для определения MAC-адреса по IP)
   - Не гарантирует доставку пакетов и их последовательность

3. **Транспортный уровень (Transport Layer)**

   - Обеспечивает передачу данных между приложениями на разных устройствах
   - Основные протоколы:
     - **TCP (Transmission Control Protocol)** – надежный, с установкой соединения
       - Гарантирует доставку данных в правильном порядке
       - Контролирует поток данных
       - Используется для HTTP, HTTPS, FTP, SMTP и т.д.
     - **UDP (User Datagram Protocol)** – ненадежный, без установки соединения
       - Быстрее, но не гарантирует доставку
       - Используется для DNS, видеостриминга, онлайн-игр, VoIP
   - Использует порты для идентификации приложений (HTTP – 80, HTTPS – 443 и т.д.)

4. **Прикладной уровень (Application Layer)**
   - Предоставляет сетевые сервисы приложениям
   - Включает множество протоколов:
     - **HTTP/HTTPS** – для веб-страниц
     - **WebSocket** – для двунаправленной связи в реальном времени
     - **DNS** – для преобразования доменных имен в IP-адреса
     - **SMTP, POP3, IMAP** – для электронной почты
     - **FTP** – для передачи файлов
     - **SSH** – для безопасного удаленного доступа

**Пример работы стека TCP/IP при загрузке веб-приложения Angular:**

1. Браузер отправляет DNS-запрос для разрешения домена в IP-адрес
2. Устанавливается TCP-соединение с сервером (три рукопожатия)
3. Отправляется HTTP-запрос по этому соединению
4. Сервер отвечает, отправляя HTML, CSS, JavaScript (Angular приложение)
5. Браузер загружает и запускает Angular-приложение
6. Приложение может делать AJAX-запросы через HTTP или устанавливать WebSocket-соединения для получения данных в реальном времени

Понимание стека TCP/IP важно для фронтенд-разработчиков, особенно при работе с сетевыми запросами, WebSocket, оптимизацией сетевого взаимодействия и устранением проблем с соединением в Angular-приложениях.

</div>
</details>

<details>
<summary>Что такое REST API, как происходит взаимодействие (расскажите про основные коды ошибок, заголовки пакетов и способы их отправки)?</summary>
<div>
**REST API (Representational State Transfer Application Programming Interface)** - это архитектурный стиль для проектирования сетевых приложений, основанный на ряде принципов, которые описывают, как сетевые ресурсы определяются и адресуются.

**Основные принципы REST:**

1. **Клиент-серверная архитектура**

   - Разделение обязанностей между клиентом (например, Angular-приложение) и сервером
   - Независимая эволюция клиента и сервера

2. **Отсутствие состояния (Statelessness)**

   - Каждый запрос от клиента должен содержать всю информацию, необходимую для его обработки
   - Сервер не хранит состояние клиента между запросами
   - Упрощает масштабирование и повышает надежность

3. **Кэширование (Cacheability)**

   - Ответы сервера могут быть помечены как кэшируемые или некэшируемые
   - Клиенты могут повторно использовать кэшированные данные, что снижает нагрузку на сеть

4. **Единообразие интерфейса (Uniform Interface)**

   - Ресурсы однозначно идентифицируются через URI
   - Манипуляция ресурсами через их представления
   - Самоописательные сообщения
   - HATEOAS (Hypermedia as the Engine of Application State) - навигация по API через ссылки

5. **Многоуровневая система (Layered System)**
   - Клиент не знает, обращается ли он напрямую к серверу или через промежуточные уровни (прокси, балансировщики)

**Основные элементы REST API:**

1. **Ресурсы** - ключевая абстракция, каждый ресурс имеет URI (например, `/users/123`)

2. **HTTP-методы** для операций CRUD:

   - **GET** - получение ресурса (чтение)
   - **POST** - создание нового ресурса
   - **PUT** - полное обновление существующего ресурса
   - **PATCH** - частичное обновление ресурса
   - **DELETE** - удаление ресурса

3. **HTTP статус-коды** для обозначения результата операции:

   - **2xx** - успешное выполнение (200 OK, 201 Created, 204 No Content)
   - **3xx** - перенаправление
   - **4xx** - ошибка клиента (400 Bad Request, 401 Unauthorized, 404 Not Found)
   - **5xx** - ошибка сервера

4. **Формат данных** - обычно JSON или XML для представления ресурсов

**Пример REST API для управления пользователями:**

```
GET    /api/users       # Получить список всех пользователей
GET    /api/users/123   # Получить пользователя с ID 123
POST   /api/users       # Создать нового пользователя
PUT    /api/users/123   # Полностью обновить пользователя 123
PATCH  /api/users/123   # Частично обновить пользователя 123
DELETE /api/users/123   # Удалить пользователя 123
```

**Работа с REST API в Angular:**

```typescript
// Пример сервиса для работы с REST API в Angular
@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "https://api.example.com/users";

  constructor(private http: HttpClient) {}

  // Получить всех пользователей
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Получить пользователя по ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Создать пользователя
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Обновить пользователя
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Частично обновить пользователя
  patchUser(id: number, partialUser: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, partialUser);
  }

  // Удалить пользователя
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

REST API широко используется в современной веб-разработке и является основным способом взаимодействия между фронтенд-приложениями на Angular и бэкенд-сервисами.

</div>
</details>

##### Основны TypeScript

<details>
<summary>Зачем нам нужны определения типов, где есть JavaScript c динамической типизацией?</summary>
<div>
 **Определения типов в TypeScript** – это один из ключевых аспектов языка, который отличает его от JavaScript и добавляет статическую типизацию. Они играют важную роль в разработке Angular-приложений, повышая качество и надежность кода.

**Основные преимущества использования типов в TypeScript:**

1. **Раннее обнаружение ошибок**

   - Ошибки типов обнаруживаются на этапе компиляции, а не во время выполнения
   - Предотвращает множество распространенных ошибок, таких как вызов метода у `undefined` или `null`
   - Снижает количество ошибок в продакшн-коде

2. **Улучшенная документация и читаемость кода**

   - Типы служат как встроенная документация
   - Легче понять, какие данные ожидает и возвращает функция
   - Новые члены команды быстрее вникают в код

3. **Улучшенные инструменты разработки**

   - Автодополнение в IDE на основе типов
   - Подсказки и проверка корректности кода в реальном времени
   - Рефакторинг с учетом типов (переименование, перемещение кода)

4. **Безопасное рефакторирование**

   - При изменении контракта (например, структуры объекта) компилятор укажет все места, которые нужно обновить
   - Уверенность при изменении кода в больших проектах

5. **Улучшенное проектирование интерфейсов**
   - Явное определение структуры данных и контрактов функций
   - Возможность использовать расширенные типы (union, intersection, generics)

**Основные способы определения типов в TypeScript:**

1. **Явное объявление типов переменных:**

   ```typescript
   const name: string = "Иван";
   const age: number = 30;
   const isActive: boolean = true;
   const user: User = { id: 1, name: "Иван" };
   ```

2. **Типизация функций (параметры и возвращаемые значения):**

   ```typescript
   function calculateTotal(items: CartItem[]): number {
     return items.reduce(
       (total, item) => total + item.price * item.quantity,
       0
     );
   }
   ```

3. **Интерфейсы для объектных структур:**

   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
     isAdmin?: boolean; // необязательное свойство
   }
   ```

4. **Типы для определения формы данных:**

   ```typescript
   type Point = {
     x: number;
     y: number;
   };

   type UserRole = "admin" | "editor" | "viewer"; // Union type
   ```

5. **Дженерики для обобщенного программирования:**

   ```typescript
   function getFirst<T>(array: T[]): T | undefined {
     return array.length > 0 ? array[0] : undefined;
   }

   const firstUser = getFirst<User>(users);
   ```

**Примеры использования типов в Angular:**

1. **Типизация компонентов:**

   ```typescript
   @Component({
     selector: "app-user-profile",
     templateUrl: "./user-profile.component.html",
   })
   export class UserProfileComponent {
     user: User | null = null;
     isLoading: boolean = true;
     error: Error | null = null;

     constructor(private userService: UserService) {}

     loadUser(id: number): void {
       this.userService.getUser(id).subscribe({
         next: (user: User) => {
           this.user = user;
           this.isLoading = false;
         },
         error: (err: Error) => {
           this.error = err;
           this.isLoading = false;
         },
       });
     }
   }
   ```

2. **Типизация HTTP-запросов:**

   ```typescript
   @Injectable({
     providedIn: "root",
   })
   export class ApiService {
     constructor(private http: HttpClient) {}

     getData<T>(url: string, params?: HttpParams): Observable<T> {
       return this.http.get<T>(url, { params });
     }

     postData<T, R>(url: string, data: T): Observable<R> {
       return this.http.post<R>(url, data);
     }
   }
   ```

3. **Типизация состояния приложения в NgRx:**

   ```typescript
   export interface AppState {
     users: UserState;
     auth: AuthState;
     products: ProductState;
   }

   export interface UserState {
     users: User[];
     selectedUser: User | null;
     loading: boolean;
     error: string | null;
   }
   ```

Определения типов в TypeScript делают разработку Angular-приложений более надежной, поддерживаемой и масштабируемой, особенно для больших проектов с несколькими разработчиками.

</div>
</details>

<details>
<summary>Что такое пользовательский тип данных</summary>
<div>
  **Пользовательский тип данных** (Custom Type) в TypeScript - это определяемый разработчиком тип, который создаётся для описания специфичных для приложения структур данных, которые не представлены встроенными типами. Пользовательские типы позволяют точно моделировать данные и бизнес-логику вашего приложения, делая код более понятным и безопасным.

**Основные способы создания пользовательских типов в TypeScript:**

1. **Интерфейсы (Interfaces)**

   - Определяют структуру объекта
   - Могут расширять другие интерфейсы
   - Существуют только во время компиляции (не генерируют JavaScript-код)

   ```typescript
   interface Product {
     id: number;
     name: string;
     price: number;
     category: string;
     inStock: boolean;
     releaseDate?: Date; // необязательное свойство
   }

   // Расширение интерфейса
   interface DiscountedProduct extends Product {
     discountPercentage: number;
     originalPrice: number;
   }
   ```

2. **Типы (Type Aliases)**

   - Создают новые имена для существующих типов
   - Могут представлять примитивы, объекты, union типы, tuple и т.д.
   - Удобны для создания сложных типов

   ```typescript
   // Простой type alias
   type UserId = number;

   // Объектный тип (похож на интерфейс)
   type User = {
     id: UserId;
     name: string;
     email: string;
   };

   // Union тип
   type Status = "pending" | "processing" | "completed" | "failed";

   // Tuple тип
   type Coordinate = [number, number];

   // Функциональный тип
   type ClickHandler = (event: MouseEvent) => void;
   ```

3. **Классы (Classes)**

   - Определяют и реализуют типы
   - Генерируют JavaScript-код
   - Сочетают определение типа с реализацией

   ```typescript
   class Customer {
     id: number;
     name: string;
     private email: string;

     constructor(id: number, name: string, email: string) {
       this.id = id;
       this.name = name;
       this.email = email;
     }

     getContactInfo(): string {
       return `${this.name} (${this.email})`;
     }
   }
   ```

4. **Enum (Перечисления)**

   - Набор именованных числовых констант
   - Улучшают читаемость кода путем использования описательных имен

   ```typescript
   enum UserRole {
     Admin = "ADMIN",
     Editor = "EDITOR",
     Viewer = "VIEWER",
   }

   // Использование
   function checkAccess(role: UserRole): boolean {
     return role === UserRole.Admin;
   }
   ```

**Расширенные возможности пользовательских типов:**

1. **Пересечение типов (Intersection Types)**

   - Комбинирование нескольких типов в один

   ```typescript
   type Employee = Person & {
     employeeId: string;
     department: string;
   };
   ```

2. **Обобщенные типы (Generics)**

   - Создание переиспользуемых типовых компонентов

   ```typescript
   interface ApiResponse<T> {
     data: T;
     status: number;
     message: string;
     timestamp: Date;
   }

   // Использование
   const usersResponse: ApiResponse<User[]> = {
     data: [{ id: 1, name: "Иван" }],
     status: 200,
     message: "OK",
     timestamp: new Date(),
   };
   ```

3. **Условные типы (Conditional Types)**

   - Выбор типа на основе условий

   ```typescript
   type ExtractIdType<T> = T extends { id: infer U } ? U : never;

   // Для User с id: number это вернет number
   type UserIdType = ExtractIdType<User>;
   ```

4. **Mapped Types (Типы отображения)**

   - Преобразование одного типа в другой

   ```typescript
   // Сделать все свойства необязательными
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };

   // Использование
   type OptionalUser = Partial<User>;
   ```

**Примеры использования пользовательских типов в Angular:**

1. **Типизация моделей данных:**

   ```typescript
   export interface User {
     id: number;
     username: string;
     email: string;
     isActive: boolean;
     registeredAt: Date;
     roles: UserRole[];
   }
   ```

2. **Типизация параметров компонентов:**

   ```typescript
   @Component({
     selector: "app-data-table",
     templateUrl: "./data-table.component.html",
   })
   export class DataTableComponent<T> {
     @Input() data: T[] = [];
     @Input() columns: TableColumn[] = [];
     @Output() rowSelected = new EventEmitter<T>();
   }

   export interface TableColumn {
     field: string;
     header: string;
     sortable?: boolean;
     width?: string;
   }
   ```

3. **Типизация действий в NgRx:**

   ```typescript
   export enum UserActionTypes {
     LOAD_USERS = "[User] Load Users",
     LOAD_USERS_SUCCESS = "[User] Load Users Success",
     LOAD_USERS_FAILURE = "[User] Load Users Failure",
   }

   export class LoadUsers implements Action {
     readonly type = UserActionTypes.LOAD_USERS;
   }

   export class LoadUsersSuccess implements Action {
     readonly type = UserActionTypes.LOAD_USERS_SUCCESS;
     constructor(public payload: { users: User[] }) {}
   }

   export type UserActions = LoadUsers | LoadUsersSuccess | LoadUsersFailure;
   ```

Пользовательские типы данных в TypeScript - мощный инструмент для создания хорошо структурированных, типобезопасных приложений Angular, что значительно повышает качество кода и упрощает его поддержку.

</div>
</details>

<details>
<summary>Что такое Union Type (тип объединения) и для чего используется?</summary>
<div>
  **Union Type (объединенный тип)** в TypeScript - это тип, который может быть одним из нескольких типов. Union тип создается с помощью оператора вертикальной черты (`|`) между типами. Это позволяет переменной, параметру функции или возвращаемому значению принимать значения разных типов.

**Основы и синтаксис Union Type:**

```typescript
// Базовый синтаксис
let value: string | number;

value = "Hello"; // OK
value = 42; // OK
value = true; // Ошибка! Тип 'boolean' не назначаемый на тип 'string | number'
```

**Основные сценарии использования Union Type:**

1. **Поддержка нескольких типов данных**

   ```typescript
   // Функция, которая принимает строку или число
   function printId(id: string | number) {
     console.log(`ID: ${id}`);
   }

   printId(101); // OK
   printId("202"); // OK
   printId({ id: 1 }); // Ошибка!
   ```

2. **Обработка возможного null/undefined**

   ```typescript
   // Функция, которая может вернуть пользователя или null, если пользователь не найден
   function getUser(id: string): User | null {
     const user = users.find((u) => u.id === id);
     return user || null;
   }
   ```

3. **Литеральные union типы (String Literal Types)**

   ```typescript
   // Допустимые статусы заказа
   type OrderStatus =
     | "new"
     | "processing"
     | "shipped"
     | "delivered"
     | "canceled";

   function updateOrderStatus(status: OrderStatus) {
     // ...
   }

   updateOrderStatus("shipped"); // OK
   updateOrderStatus("returning"); // Ошибка! Тип 'returning' не назначаемый на тип OrderStatus
   ```

4. **Дискриминированные объединения (Discriminated Unions)**

   ```typescript
   interface Circle {
     kind: "circle";
     radius: number;
   }

   interface Square {
     kind: "square";
     sideLength: number;
   }

   type Shape = Circle | Square;

   function getArea(shape: Shape): number {
     // Используем discriminator свойство 'kind' для определения типа
     switch (shape.kind) {
       case "circle":
         // TypeScript знает, что здесь shape имеет тип Circle
         return Math.PI * shape.radius ** 2;
       case "square":
         // Здесь shape имеет тип Square
         return shape.sideLength ** 2;
     }
   }
   ```

**Работа с Union типами:**

1. **Сужение типов (Type Narrowing)**

   ```typescript
   function process(value: string | number) {
     // Используем typeof для сужения типа
     if (typeof value === "string") {
       // В этом блоке TypeScript знает, что value - это string
       return value.toUpperCase();
     } else {
       // А здесь value - это number
       return value.toFixed(2);
     }
   }
   ```

2. **Работа с общими свойствами**

   ```typescript
   function getLength(value: string | string[]) {
     // Свойство length доступно у обоих типов
     return value.length;
   }
   ```

3. **Проверка на наличие свойств**

   ```typescript
   interface Car {
     make: string;
     model: string;
     drive(): void;
   }

   interface Boat {
     make: string;
     model: string;
     sail(): void;
   }

   function operate(vehicle: Car | Boat) {
     console.log(`${vehicle.make} ${vehicle.model}`);

     // Проверяем наличие метода для сужения типа
     if ("drive" in vehicle) {
       // TypeScript знает, что здесь vehicle - это Car
       vehicle.drive();
     } else {
       // Здесь vehicle - это Boat
       vehicle.sail();
     }
   }
   ```

**Примеры использования Union Type в Angular:**

1. **Обработка различных состояний данных**

   ```typescript
   type DataState<T> =
     | { status: "loading" }
     | { status: "loaded"; data: T }
     | { status: "error"; error: Error };

   @Component({
     selector: "app-user-list",
     template: `
       <div *ngIf="state.status === 'loading'">Loading...</div>
       <div *ngIf="state.status === 'loaded'">
         <user-item *ngFor="let user of state.data" [user]="user"></user-item>
       </div>
       <div *ngIf="state.status === 'error'">
         Error: {{ state.error.message }}
       </div>
     `,
   })
   export class UserListComponent {
     state: DataState<User[]> = { status: "loading" };

     loadData() {
       this.userService.getUsers().subscribe({
         next: (data) => {
           this.state = { status: "loaded", data };
         },
         error: (error) => {
           this.state = { status: "error", error };
         },
       });
     }
   }
   ```

2. **Типизация входных параметров компонента**

   ```typescript
   @Component({
     selector: "app-avatar",
     template: `
       <div [ngSwitch]="getAvatarType()">
         <img *ngSwitchCase="'image'" [src]="avatar" alt="User avatar" />
         <div *ngSwitchCase="'text'" class="text-avatar">
           {{ getInitials() }}
         </div>
         <div *ngSwitchDefault class="default-avatar"></div>
       </div>
     `,
   })
   export class AvatarComponent {
     @Input() avatar: string | { name: string } | null = null;

     getAvatarType(): "image" | "text" | "none" {
       if (!this.avatar) return "none";
       if (typeof this.avatar === "string") return "image";
       if (this.avatar.name) return "text";
       return "none";
     }

     getInitials(): string {
       return typeof this.avatar === "object" && this.avatar
         ? this.avatar.name.charAt(0).toUpperCase()
         : "";
     }
   }
   ```

3. **Типизация результатов HTTP-запросов**

   ```typescript
   @Injectable({
     providedIn: "root",
   })
   export class DataService {
     constructor(private http: HttpClient) {}

     fetchData<T>(url: string): Observable<T | Error> {
       return this.http.get<T>(url).pipe(
         catchError((error) => {
           return of(new Error(`Failed to fetch data: ${error.message}`));
         })
       );
     }
   }
   ```

Union типы - мощный инструмент TypeScript, который позволяет создавать точные и гибкие контракты для данных и функций в Angular-приложениях, повышая типобезопасность и снижая количество потенциальных ошибок.

</div>
</details>

<details>
<summary>Поддерживает ли TypeScript перегрузку методов?</summary>
<div>
  **TypeScript поддерживает перегрузку методов**, но только на уровне объявления типов, не на уровне реализации. В TypeScript можно определить несколько сигнатур для одного метода, но реализация должна быть одна и должна покрывать все варианты.

**Как работает перегрузка в TypeScript:**

1. Определяются несколько сигнатур метода/функции
2. Последняя сигнатура содержит реализацию, которая должна быть совместима со всеми объявленными сигнатурами
3. Внутри реализации нужно использовать проверки типов для обработки разных вариантов вызова

**Пример перегрузки функции:**

```typescript
// Объявления сигнатур перегрузки
function greet(name: string): string;
function greet(names: string[]): string[];

// Реализация, покрывающая все сигнатуры
function greet(nameOrNames: string | string[]): string | string[] {
  if (Array.isArray(nameOrNames)) {
    return nameOrNames.map((name) => `Привет, ${name}!`);
  } else {
    return `Привет, ${nameOrNames}!`;
  }
}

// Использование
const result1 = greet("Иван"); // "Привет, Иван!"
const result2 = greet(["Иван", "Мария"]); // ["Привет, Иван!", "Привет, Мария!"]
```

**Перегрузка методов в классах:**

```typescript
class Calculator {
  // Объявления перегрузок
  add(a: number, b: number): number;
  add(a: string, b: string): string;

  // Реализация
  add(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a.concat(b);
    }
    throw new Error("Параметры должны быть одного типа");
  }
}

const calc = new Calculator();
console.log(calc.add(1, 2)); // 3
console.log(calc.add("Hello, ", "World")); // "Hello, World"
```

В Angular перегрузка методов часто используется в сервисах, особенно при работе с HTTP-запросами или обработке данных в различных форматах.

</details>

<details>
<summary>Возможна ли перегрузка конструктора в TypeScript?</summary>

**Да, в TypeScript возможна перегрузка конструктора**, но с теми же ограничениями, что и перегрузка методов - только на уровне типов, а реализация должна быть одна. Перегрузка конструктора позволяет создавать экземпляры класса с разными наборами параметров.

**Пример перегрузки конструктора:**

```typescript
class Point {
  x: number;
  y: number;

  // Объявления перегрузок конструктора
  constructor();
  constructor(x: number, y: number);
  constructor(coords: { x: number; y: number });

  // Реализация, которая учитывает все варианты
  constructor(xOrCoords?: number | { x: number; y: number }, y?: number) {
    if (xOrCoords === undefined && y === undefined) {
      this.x = 0;
      this.y = 0;
    } else if (typeof xOrCoords === "number" && typeof y === "number") {
      this.x = xOrCoords;
      this.y = y;
    } else if (typeof xOrCoords === "object") {
      this.x = xOrCoords.x;
      this.y = xOrCoords.y;
    } else {
      throw new Error("Неверные параметры");
    }
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

// Использование с разными вариантами
const p1 = new Point(); // (0, 0)
const p2 = new Point(5, 10); // (5, 10)
const p3 = new Point({ x: 15, y: 20 }); // (15, 20)
```

В Angular классы компонентов часто используют перегрузку конструкторов для поддержки различных вариантов инициализации, особенно при создании переиспользуемых компонентов библиотек.

**Пример в контексте Angular:**

```typescript
@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
})
export class UserCardComponent {
  user: User;

  // Перегрузки конструктора
  constructor();
  constructor(userId: number);
  constructor(user: User);

  // Реализация
  constructor(userOrUserId?: User | number) {
    if (userOrUserId === undefined) {
      // Создание дефолтного пользователя
      this.user = { id: 0, name: "Гость", isActive: false };
    } else if (typeof userOrUserId === "number") {
      // Загрузка пользователя по ID через сервис
      // В реальном коде здесь использовался бы userService.getUser(userOrUserId)
      this.user = {
        id: userOrUserId,
        name: `Пользователь ${userOrUserId}`,
        isActive: true,
      };
    } else {
      // Использование переданного пользователя
      this.user = userOrUserId;
    }
  }
}
```

Важно помнить, что в TypeScript все перегруженные конструкторы, как и методы, должны быть совместимы с одной общей реализацией.

</div>
</details>

<details>
<summary>Поддерживает ли TypeScript перегрузку методов (конструкторов)?</summary>
<div>
TypeScript поддерживает перегрузку методов и конструкторов, но реализация перегрузки в TypeScript отличается от классических объектно-ориентированных языков (например, C++ или Java).

В TypeScript используется механизм объявления нескольких сигнатур функции или метода с последующей реализацией одной функции, которая обрабатывает все варианты:

```typescript
class Calculator {
  // Объявление перегруженных сигнатур
  add(a: number, b: number): number;
  add(a: string, b: string): string;

  // Реализация
  add(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b; // числовое сложение
    }
    return a.toString() + b.toString(); // строковая конкатенация
  }
}
```

Для перегрузки конструкторов подход аналогичный:

```typescript
class Person {
  name: string;
  age: number;

  // Объявление перегруженных сигнатур конструктора
  constructor(name: string);
  constructor(name: string, age: number);

  // Реализация конструктора
  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age !== undefined ? age : 0;
  }
}
```

Важно понимать, что эта перегрузка существует только на уровне системы типов TypeScript во время компиляции. В скомпилированном JavaScript-коде будет только одна функция с проверками типов. Это связано с тем, что JavaScript не поддерживает перегрузку функций на уровне языка.

</div>
</details>

<details>
<summary>Что такое декоратор и какие виды декораторов вы знаете?</summary>

<br>

Декоратор — способ добавления метаданных к объявлению класса. Это специальный вид объявления, который может быть присоединен к объявлению класса, методу, методу доступа, свойству или параметру. <br>
<br>Декораторы используют форму @expression, где expression - функция, которая будет вызываться во время выполнения с информацией о декорированном объявлении.<br>
<br>И, чтобы написать собственный декоратор, нам нужно сделать его factory и определить тип:

  <ul>
    <li>ClassDecorator</li>
    <li>PropertyDecorator</li>
    <li>MethodDecorator</li>
    <li>ParameterDecorator</li>
  </ul>
    
  <b>Декоратор класса</b>
  <div>

Вызывается перед объявлением класса, применяется к конструктору класса и может использоваться для наблюдения, изменения или замены определения класса. Expression декоратора класса будет вызываться как функция во время выполнения, при этом конструктор декорированного класса является единственным аргументом. Если класс декоратора возвращает значение, он заменит объявление класса вернувшимся значением. <br>

```ts
export function logClass(target: Function) {
  // Сохранение ссылки на оригинальный конструктор
  const original = target;

  // Функция генерирует экземпляры класса
  function construct(constructor, args) {
    const c: any = function () {
      return constructor.apply(this, args);
    };
    c.prototype = constructor.prototype;
    return new c();
  }

  // Определение поведения нового конструктора
  const f: any = function (...args) {
    console.log(`New: ${original["name"]} is created`);
    //New: Employee создан
    return construct(original, args);
  };

  // Копирование прототипа, чтобы оператор intanceof работал
  f.prototype = original.prototype;

  // Возвращает новый конструктор, переписывающий оригинальный
  return f;
}

@logClass
class Employee {}

let emp = new Employee();
console.log("emp instanceof Employee");
//emp instanceof Employee
console.log(emp instanceof Employee);
//true
```

  </div>
  
  <br><b>Декоратор свойства</b>
  
  <div>
  
  Объявляется непосредственно перед объявлением метода. Будет вызываться как функция во время выполнения со следующими двумя аргументами:
 
  <ul>
    <li>target - прототип текущего объекта, т.е. если Employee является объектом, Employee.prototype</li>
    <li>propertyKey - название свойства</li>
  </ul>

```ts
function logParameter(target: Object, propertyName: string) {
  // Значение свойства
  let _val = this[propertyName];

  // Геттер свойства
  const getter = () => {
    console.log(`Get: ${propertyName} => ${_val}`);
    return _val;
  };

  // Сеттер свойства
  const setter = (newVal) => {
    console.log(`Set: ${propertyName} => ${newVal}`);
    _val = newVal;
  };

  // Удаление свойства
  if (delete this[propertyName]) {
    // Создает новое свойство с геттером и сеттером
    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
}

class Employee {
  @logParameter
  name: string;
}

const emp = new Employee();
emp.name = "Mohan Ram";
console.log(emp.name);

// Set: name => Mohan Ram
// Get: name => Mohan Ram
// Mohan Ram
```

  </div>
  
  <br><b>Декоратор метода</b>
 
  <div>
  
  Объявляется непосредственно перед объявлением метода. Будет вызываться как функция во время выполнения со следующими двумя аргументами:
 
  <ul>
    <li>target - прототип текущего объекта, т.е. если Employee является объектом, Employee.prototype</li>
    <li>propertyName - название свойства</li>
    <li>descriptor - дескриптор свойства метода т.е. - Object.getOwnPropertyDescriptor (Employee.prototype, propertyName)</li>
  </ul>
 
   ```ts
    export function logMethod(
        target: Object,
        propertyName: string,
        propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
        const method = propertyDescriptor.value;
    
        propertyDescriptor.value = function (...args: any[]) {
    
            // Конвертация списка аргументов greet в строку
            const params = args.map(a => JSON.stringify(a)).join();
    
            // Вызов greet() и получение вернувшегося значения
            const result = method.apply(this, args);
    
            // Конвертация результата в строку
            const r = JSON.stringify(result);
    
            // Отображение в консоли деталей вызова
            console.log(`Call: ${propertyName}(${params}) => ${r}`);
    
            // Возвращение результата вызова
            return result;
        }
        return propertyDescriptor;
    }
    
    class Employee {
    
        constructor(
            private firstName: string,
            private lastName: string
        ) {
        }
    
        @logMethod
        greet(message: string): string {
            return `${this.firstName} ${this.lastName} says: ${message}`;
        }
    
    }
    
    const emp = new Employee('Mohan Ram', 'Ratnakumar');
    emp.greet('hello');
    //Call: greet("hello") => "Mohan Ram Ratnakumar says: hello"
   ```
   </div>
   
   <br><b>Декоратор параметра</b>

<div>

Объявляется непосредственно перед объявлением метода. Будет вызываться как функция во время выполнения со следующими двумя аргументами:

  <ul>
    <li>target - прототип текущего объекта, т.е. если Employee является объектом, Employee.prototype</li>
    <li>propertyKey - название свойства</li>
    <li>index - индекс параметра в массиве аргументов</li>
  </ul>
  
</div>

```ts
function logParameter(target: Object, propertyName: string, index: number) {
  // Генерация метаданных для соответствующего метода
  // для сохранения позиции декорированных параметров
  const metadataKey = `log_${propertyName}_parameters`;

  if (Array.isArray(target[metadataKey])) {
    target[metadataKey].push(index);
  } else {
    target[metadataKey] = [index];
  }
}

class Employee {
  greet(@logParameter message: string): void {
    console.log(`hello ${message}`);
  }
}
const emp = new Employee();
emp.greet("world");
```

</details>

##### Основные концепции

<details>
<summary>Что такое Angular?</summary>
<div><br>
<img src="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/033/thumb/egghead-angular-material-course-sq.png" align="left" alt=""><p><b>Angular</b>&nbsp;&mdash; это платформа для разработки мобильных и&nbsp;десктопных веб-приложений. Наши приложения теперь представляют из&nbsp;себя &laquo;толстый клиент&raquo;, где управление отображением и&nbsp;часть логики перенесены на&nbsp;сторону браузера. Так сервер уделяет больше времени доставке данных, плюс пропадает необходимость в&nbsp;постоянной перерисовке. С&nbsp;Angular мы&nbsp;описываем структуру приложения декларативно, а&nbsp;с&nbsp;TypeScript начинаем допускать меньше ошибок, благодаря статической типизации. В&nbsp;Angular присутствует огромное количество возможностей из&nbsp;коробки. Это может быть одновременно и&nbsp;хорошо и&nbsp;плохо, в&nbsp;зависимости от&nbsp;того, что вам необходимо.</p><hr>
  
<b>Какие плюсы можно выделить</b>:
<ul>
  <li>Поддержка Google, Microsoft</li>
  <li>Инструменты разработчика (CLI)</li>
  <li>Typescript из коробки</li>
  <li>Реактивное программирование с RxJS</li>
  <li>Единственный фреймворк с Dependency Injection из коробки</li>
  <li>Шаблоны, основанные на расширении HTML</li>
  <li>Кроссбраузерный Shadow DOM из коробки (либо его эмуляция) </li>
  <li>Кроссбраузерная поддержка HTTP, WebSockets, Service Workers</li>
  <li>Не нужно ничего дополнительно настраивать. Больше никаких оберток. jQuery плагины и D3 можно использовать на прямую</li>
  <li>Более современный фреймворк, чем AngularJS (на уровне React, Vue)</li>
  <li>Большое комьюнити</li>
</ul>

<b>Минусы</b>:

<ul>
  <li>Выше порог вхождения из-за Observable (RxJS) и Dependency Injection</li>
  <li>Чтобы все работало хорошо и быстро нужно тратить время на дополнительные оптимизации 
    (он не супер быстрый, по умолчанию, но быстрее AngularJS во много раз)</li>
  <li>Если вы планируете разрабатывать большое enterprise-приложение, то в этом случае, у вас нет архитектуры из коробки - нужно добавлять Mobx, Redux, MVVM, CQRS/CQS или другой state-менеджер, чтобы потом не сломать себе мозг</li>
  <li>Angular-Universal имеет много подводных камней</li>
  <li>Динамическое создание компонентов оказывается нетривиальной задачей</li>
</ul>

</div>
</details>

<details>
<summary>В чем разница между AngularJS и Angular?</summary>
<div>
  
<br><b>AngularJS</b> является фреймворком, который может помочь вам в разработке Single Page Application. Он появился в 2009 году и с годами выяснилось, что имел много проблем. <b>Angular</b> (Angular 2+) же в свою очередь направлен на тоже самое, но дает больше преимуществ по сравнению с AngularJS 1.x, включая лучшую производительность, ленивую загрузку, более простой API, более легкую отладку.

<b>Что появилось в Angular</b>: <br>

<ul>
  <li>Angular ориентирован на мобильные платформы и имеет лучшую производительность</li>  
  <li>Angular имеет встроенные сервисы для поддержки интернационализации</li>
  <li>AngularJS проще настроить, чем Angular</li>
  <li>AngularJS использует контроллеры и $scope</li>
  <li>Angular имеет много способов определения локальных переменных</li>
  <li>В Angular новый синтаксис структурных директив (camelCase)</li>
  <li>Angular работает напрямую с свойствами и событиями DOM элементов</li>
  <li>Одностороннее связывание данных через [property]</li>
  <li>Двустороннее связывание данных через [(property)]</li>
  <li>Новый механизм DI, роутинга, запуска приложения</li>
</ul>

<b>Основные преимущества Angular</b>: <br>

<ul>
  <li>Обратная совместимость Angular 2, 4, 5, ..</li>
  <li>TypeScript с улучшенной проверкой типов</li>
  <li>Встроенный компилятор с режимами JIT и AOT (+сокращение кода)</li>
  <li>Встроенные анимации</li>
</ul>

</div>
</details>

<details>
<summary>Какой должна быть структура каталогов компонентов любого Angular приложения и почему?</summary>
<div>
**Структура каталогов Angular-приложения** должна быть организована таким образом, чтобы обеспечить модульность, масштабируемость и удобство сопровождения. Единого "правильного" способа не существует, но есть общепринятые практики, рекомендуемые Angular.

**Основные принципы организации каталогов:**

1. **Модульная структура** - группировка по функциональности
2. **Организация по фичам** - компоненты, связанные с одной фичей, группируются вместе
3. **Ограничение глубины вложенности** - не слишком глубокая иерархия для удобной навигации

**Стандартная структура Angular-приложения:**

```
app/
├── core/                 # Синглтон-сервисы, глобальные компоненты, guards, interceptors
│   ├── auth/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   └── core.module.ts
│
├── shared/               # Общие компоненты, директивы, пайпы, используемые во многих модулях
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   ├── models/
│   └── shared.module.ts
│
├── features/             # Модули функциональности (фичи)
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.scss
│   │   │   │   └── dashboard.component.spec.ts
│   │   │   └── ...
│   │   ├── services/
│   │   ├── models/
│   │   └── dashboard.module.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── users.module.ts
│   │
│   └── ...
│
├── layouts/              # Компоненты макета (шаблоны страниц)
│   ├── main-layout/
│   └── auth-layout/
│
├── app-routing.module.ts # Основной роутинг
├── app.component.ts      # Корневой компонент
├── app.module.ts         # Корневой модуль
└── ...
```

**Структура файлов компонента:**

Каждый компонент обычно состоит из следующих файлов:

- `component-name.component.ts` - класс компонента
- `component-name.component.html` - шаблон
- `component-name.component.scss` (или .css) - стили
- `component-name.component.spec.ts` - тесты

**Рекомендации Angular Style Guide:**

1. **LIFT принцип**:

   - **L**ocate - легко найти код
   - **I**dentify - легко идентифицировать компоненты
   - **F**lat - плоская структура, не слишком много вложенности
   - **T**ry to be DRY (Don't Repeat Yourself) - избегать дублирования

2. **Именование файлов**:

   - Использовать kebab-case для имен файлов
   - Включать тип файла в имя (component, service, module и т.д.)
   - Примеры: `user-list.component.ts`, `auth.service.ts`

3. **Модульная структура**:
   - Каждая фича - отдельный модуль
   - Общие компоненты - в shared модуле
   - Глобальные синглтон-сервисы - в core модуле

**Пример структуры файлов компонента с использованием standalone компонентов:**

```
features/
└── products/
    ├── components/
    │   ├── product-list/
    │   │   ├── product-list.component.ts
    │   │   ├── product-list.component.html
    │   │   └── product-list.component.scss
    │   │
    │   ├── product-details/
    │   │   ├── product-details.component.ts
    │   │   ├── product-details.component.html
    │   │   └── product-details.component.scss
    │   │
    │   └── product-form/
    │       ├── product-form.component.ts
    │       ├── product-form.component.html
    │       └── product-form.component.scss
    │
    ├── services/
    │   └── product.service.ts
    │
    ├── models/
    │   └── product.model.ts
    │
    └── products.routes.ts  # Для standalone компонентов
```

Важно отметить, что структура может различаться в зависимости от размера проекта, команды и конкретных требований, но должна следовать принципам согласованности и организации кода.

</div>
</details>

<details>
<summary>Что такое MVVM и в чем разница перед MVC?</summary>
<div>
  <br> <b>MVVM</b> - шаблон проектирования архитектуры приложения. Состоит из 3 ключевых блоков: Model, View, ViewModel.
  <br>Отличие от MVС заключаются в: <br> <br>
  
  <li>View реагирует на действия пользователя и передает их во View Model через Data Binding.</li>
  <li>View Model, в отличие от контроллера в MVC, имеет особый механизм, автоматизирующий связь между View и связанными свойствами в ViewModel.</li>
  
  <br>Привязка данных между View и ViewModel может быть односторонней или двусторонней (one-way, two-way data-binding).
</div>
</details>

##### Angular Template синтаксис

<details>
<summary>Что такое интерполяция в Angular?</summary>
<div><br>
  
Разметка интерполяции с внедренными выражениями используется в Angular для присвоения данных текстовым нодам и значения аттрибутов. Например:
  
  ```html
    <a href="img/{{username}}.jpg">Hello {{username}}!</a>
  ```
  
<br>
</div>

</details>

<details>
<summary>Какие способы использования шаблонов в Angular вы знаете?</summary>
<div>
**В Angular существуют два основных способа определения шаблонов компонентов:**

1. **Встроенные (inline) шаблоны** - определяются прямо в декораторе компонента
2. **Внешние (external) шаблоны** - определяются в отдельных HTML-файлах

**1. Встроенные шаблоны:**

```typescript
@Component({
  selector: "app-greeting",
  template: `
    <div class="greeting">
      <h1>Привет, {{ name }}!</h1>
      <button (click)="sayHello()">Поздороваться</button>
    </div>
  `,
  styles: [
    `
      .greeting {
        padding: 10px;
      }
      h1 {
        color: blue;
      }
    `,
  ],
})
export class GreetingComponent {
  name: string = "Мир";

  sayHello() {
    alert(`Привет, ${this.name}!`);
  }
}
```

**Преимущества встроенных шаблонов:**

- Все в одном файле, не нужно переключаться между файлами
- Проще для небольших компонентов
- Удобно для динамически создаваемых компонентов

**2. Внешние шаблоны:**

```typescript
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent {
  user: User;

  // ...
}
```

Содержимое `user-profile.component.html`:

```html
<div class="user-profile">
  <h2>{{ user.name }}</h2>
  <p>Email: {{ user.email }}</p>
  <p>Registered: {{ user.registrationDate | date }}</p>

  <button (click)="editProfile()">Редактировать профиль</button>
</div>
```

**Преимущества внешних шаблонов:**

- Лучшая организация кода для сложных компонентов
- Поддержка подсветки синтаксиса HTML в редакторах
- Лучше подходит для совместной работы команды

**Дополнительные способы работы с шаблонами:**

**3. Динамические шаблоны с ng-template:**

```html
<ng-template #userTemplate let-user>
  <div class="user-item">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</ng-template>

<div *ngIf="isLoggedIn; else loginPrompt">
  <ng-container
    *ngTemplateOutlet="userTemplate; context: { $implicit: currentUser }"
  ></ng-container>
</div>

<ng-template #loginPrompt>
  <p>Пожалуйста, войдите в систему</p>
</ng-template>
```

**4. Встраиваемые представления с ng-container:**

```html
<ng-container *ngIf="users.length > 0">
  <h2>Список пользователей</h2>
  <ul>
    <li *ngFor="let user of users">{{ user.name }}</li>
  </ul>
</ng-container>

<ng-container [ngSwitch]="userRole">
  <div *ngSwitchCase="'admin'">Панель администратора</div>
  <div *ngSwitchCase="'editor'">Панель редактора</div>
  <div *ngSwitchDefault>Обычный пользователь</div>
</ng-container>
```

**5. Компоненты с содержимым (Content Projection):**

Шаблон компонента `card.component.html`:

```html
<div class="card">
  <div class="card-header">
    <ng-content select="[card-title]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>
  </div>
  <div class="card-footer">
    <ng-content select="[card-footer]"></ng-content>
  </div>
</div>
```

Использование:

```html
<app-card>
  <h2 card-title>Заголовок карточки</h2>
  <p>Содержимое карточки</p>
  <p>Еще один параграф</p>
  <div card-footer>
    <button>Ок</button>
    <button>Отмена</button>
  </div>
</app-card>
```

**6. Условный рендеринг и циклы:**

```html
<!-- Условный рендеринг -->
<div *ngIf="isVisible">Этот элемент видим</div>

<!-- Цикл для списков -->
<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackByFn">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>

<!-- Комбинация условий и циклов -->
<div *ngIf="items.length > 0; else emptyList">
  <ul>
    <li *ngFor="let item of items">{{ item.name }}</li>
  </ul>
</div>
<ng-template #emptyList>
  <p>Список пуст</p>
</ng-template>
```

Выбор способа использования шаблонов зависит от сложности компонента, предпочтений команды и конкретных требований проекта. В крупных проектах чаще используются внешние шаблоны для лучшей организации кода.

</div>
</details>

<details>
<summary>В чем разница между структурной и атрибутной директивой, назовите встроенные директивы?</summary>
<div>
  <br><li>Структурные директивы влияют на DOM и могут добавлять/удалять элементы  <br> (ng-template, NgIf, NgFor, NgSwitch, etc) </li>
  <li>Атрибутные директивы меняют внешний вид или поведение элементов, компонентов или других директив  <br> (NgStyle, NgClass, etc).</li>
</div>
</details>

<details>
<summary>Для чего нужны директивы ng-template, ng-container, ng-content?</summary>
<div>
  <h4>1. ng-template</h4>
  
  `<template>` — это механизм для отложенного рендера клиентского контента, который не отображается во время загрузки, но может быть инициализирован при помощи JavaScript. <br><br>
  Template можно представить себе как фрагмент контента, сохранённый для последующего использования в документе. Хотя парсер и обрабатывает содержимое элемента `template` во время загрузки страницы, он делает это только чтобы убедиться в валидности содержимого; само содержимое при этом не отображается. <br><br>
  
  `<ng-template>` - является имплементацией стандартного элемента template, данный элемент появился с четвертой версии Angular, это было сделано с точки зрения совместимости со встраиваемыми на страницу template элементами, которые могли попасть в шаблон ваших компонентов по тем или иным причинам. <br><br>

Пример:

```html
<div class="lessons-list" *ngIf="lessons else loading">...</div>

<ng-template #loading>
  <div>Loading...</div>
</ng-template>
```

  <h4>2. ng-container</h4>
  
  `<ng-container>` - это логический контейнер, который может использоваться для группировки узлов, но не отображается в дереве DOM как узел (node).

На самом деле структурные директивы (*ngIf, *ngFor, …) являются синтаксическим сахаром для наших шаблонов. В реальности, данные шаблоны трансформируются в такие конструкции:

```html
<ng-template [ngIf]="lessons" [ngIfElse]="loading">
   <div class="lessons-list">
     ...
   </div>
</div>

<ng-template #loading>
    <div>Loading...</div>
</ng-template>
```

Но что делать, если я хочу применить несколько структурных директив?
(спойлер: к сожалению, так нельзя сделать)

```html
<div class="lesson" *ngIf="lessons" *ngFor="let lesson of lessons">
  <div class="lesson-detail">{{lesson | json}}</div>
</div>
```

```
Uncaught Error: Template parse errors:
Can't have multiple template bindings on one element. Use only one attribute
named 'template' or prefixed with *
```

Но можно сделать так:

```html
<div *ngIf="lessons">
  <div class="lesson" *ngFor="let lesson of lessons">
    <div class="lesson-detail">{{lesson | json}}</div>
  </div>
</div>
```

Однако, чтобы избежать необходимости создавать дополнительный div, мы можем вместо этого использовать директиву ng-container:

```html
<ng-container *ngIf="lessons">
  <div class="lesson" *ngFor="let lesson of lessons">
    <div class="lesson-detail">{{lesson | json}}</div>
  </div>
</ng-container>
```

Как мы видим, директива ng-container предоставляет нам элемент, в котором мы можем использовать структурную директиву, без необходимости создавать дополнительный элемент.

Еще пара примечательных примеров, если все же вы хотите использовать ng-template вместо ng-container, по определенным правилам вы не сможете использовать полную конструкцию структурных директив.

Вы можете писать либо так:

```html
<div class="mainWrap">
  <ng-container *ngIf="true">
    <h2>Title</h2>
    <div>Content</div>
  </ng-container>
</div>
```

Либо так:

```html
<div class="mainWrap">
  <ng-template [ngIf]="true">
    <h2>Title</h2>
    <div>Content</div>
  </ng-template>
</div>
```

На выходе, при рендеринге будет одно и тоже:

```html
<div class="mainWrap">
  <h2>Title</h2>
  <div>Content</div>
</div>
```

 <h4>3. ng-content</h4>
 
`<ng-content>` - позволяет внедрять родительским компонентам html-код в дочерние компоненты.
 
Здесь на самом деле, немного сложнее уже чем с ng-template, ng-container. Так как ng-content решает задачу проецирования контента в ваши веб-компоненты. Веб-компоненты состоят из нескольких отдельных технологий. Вы можете думать о Веб-компонентах как о переиспользуемых виджетах пользовательского интерфейса, которые создаются с помощью открытых веб-технологий. Они являются частью браузера и поэтому не нуждаются во внешних библиотеках, таких как jQuery или Dojo. Существующий Веб-компонент может быть использован без написания кода, просто путем импорта выражения на HTML-страницу. Веб-компоненты используют новые или разрабатываемые стандартные возможности браузера.

Давайте представим ситуацию от обратного, нам нужно параметризовать наш компонент. Мы хотим сделать так, чтобы на вход в компонент мы могли передать какие-либо статичные данные. Это можно сделать несколькими способами.

comment.component.ts:

```ts
@Component({
  selector: "comment",
  template: `
    <h1>Комментарий:</h1>
    <p>{{ data }}</p>
  `,
})
export class CommentComponent {
  @Input() data: string = null;
}
```

app.component.html

```html
<div *ngFor="let message of comments">
  <comment [data]="message"></comment>
</div>
```

Но можно поступить и другим путем. <br>
comment.component.ts:

```ts
@Component({
  selector: "comment",
  template: `
    <h1>Комментарий:</h1>
    <ng-content></ng-content>
  `,
})
export class CommentComponent {}
```

app.component.html

```html
<div *ngFor="let message of comments">
  <comment>
    <p>{{message}}</p>
  </comment>
</div>
```

Конечно, эти примеры плохо демонстрируют подводные камни, свои плюсы и минусы. Но второй способ демонстрирует подход при работе, когда мы оперируем независимыми абстракциями и можем проецировать контент внутрь наших компонентов (подход веб-компонентов).

</div>
</details>

##### Angular development environments

<details>
<summary>Что такое директива и как создать собственную?</summary>
<div>

<br>

Директивы бывают трех видов: компонент, структурные и атрибутные (см. выше).

<h4>Создание атрибутных директив:</h4>
  
```ts
@Directive({ 
   selector: '[appHighlight]' 
})
export class HighlightDirective {  }
```

<br>

Декоратор определяет селектор атрибута [appHighlight], [] - указывают что это селектор атрибута. Angular найдет каждый элемент в шаблоне с этим атрибутом и применит к ним логику директивы.

```ts
@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = "yellow";
  }
}
```

<br>Необходимо указать в конструкторе ElementRef, чтобы через его свойство nativeElement иметь прямой доступ к DOM элементу, который должен быть изменен.
<br>Теперь, используя @HostListener, можно добавить обработчики событий, взаимодействующие с декоратором.

```ts
@Component()
class EtcComponent {
  @HostListener("mouseenter")
  public onMouseEnter(): void {
    this.highlight("yellow");
  }

  @HostListener("mouseleave")
  public onMouseLeave(): void {
    this.highlight(null);
  }

  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

<h4>Структурные директивы создаются так:</h4>

Напишем UnlessDirective, которая будет противоположна NgIf.
<br>Необходимо использовать @Directive, и импортировать Input, TemplateRef, и ViewContainerRef. Они вам понадобятся при воздании любой структурной директивы.

```ts
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({ selector: "[appUnless]" })
export class UnlessDirective {}
```

В конструкторе мы получаем доступ к view container и содержимое <ng-template>.

```
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
```

Наша директива предполагает работу с true/false. Для этого нужно свойство appUnless, добавленное через @Input.

```ts
@Directive({ selector: "[appUnless]" })
export class UnlessDirective {
  @Input() public set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

</div>
</details>

<details>
<summary>Что такое директива, компонент, модуль, сервис, пайп в Angular и для чего они нужны?</summary>

<div>
    <br>
    <ul>
      <li>Директива - см. выше.</li>
      <li>Компонент контролирует участок экрана, т.н. view.</li>
      <li>Сервис это класс с узкой, четко определенной целью. Это может быть значение, функция, запрос, etc. Главное в них то, что они повторно используются, отделяя чистую функциональность компонента. </li>
      <li>Пайп преобразует отображение значений в шаблоне, к примеру отображение дат в разных локалях или изменяют в отображении регистр строк.</li>
    </ul>
</div>

</details>

<details>
<summary>Расскажите об основных параметрах @NgModule, @Component, @Directive, @Injectable, @Pipe</summary>
<div>
 <br>
 
 Декораторы динамически подключают дополнительное поведение к объекту. Они помечают класс и предоставляют конфигурационные метаданные.
 <h4>@NgModule может содержать следующие параметры:</h4>
 <li>providers - список инжектируемых объектов, которые добавляются в этот модуль</li>
 <li>declarations - компоненты, директивы и пайпы, принадлежащие этому модулю</li>
 <li>imports - модули, которые экспортируются декларируемыми и доступны в шаблоне этого модуля</li>
 <li>exports - компоненты, директивы и пайпы, которые объявлены декларируемыми, и могут быть им пользованы в шаблоне любого компонента, которые принадлежит NgModule импортирующему их.</li>
 <li>entryComponent - компилируемые компоненты при определении NgModule, для динамической загрузки в view.</li>
 <li>bootstrap - компоненты, которые загружаются при загрузке этого модуля, автоматически добавляются в entryComponent. </li>
 <li>schemas - набор схем, объявляющих разрешенные элементы в MgModules</li>
 <li>id - имя или путь, уникальный идентификатор этого NgModule в getModuleFactory. Если не заполнять - не будет там зарегистрирован.</li>
 <li>jit - если true, то этот модуль будет пропущен компилятором AOT и всегда будет компилироваться JIT.</li>
 
 <h4>@Component может содержать следующие параметры:</h4>
 <li>changeDetection - стратегия обнаружения изменений, используемая для этого компонента</li>
 <li>viewProviders - инжектируемые объекты, которые видны DOM children этого компонента. </li>
 <li>moduleId - id модуля, к которому относится компонент.</li>
 <li>templateUrl - относительный путь или абсолютный URL к шаблону компонента.</li>
 <li>template - инлайн шаблон для этого компонента.</li>
 <li>styleUrls - один и более путь до файла, содержащего CSS, абсолютный или относительный.</li>
 <li>styles - инлайн CSS, используемые в этом компоненте.</li>
 <li>animations - один и более вызовов анимации trigger(), содержащих state() и transition(). </li>
 <li>encapsulation - правила инкапсуляции для шаблона и CSS.</li>
 <li>interpolation - переопределение базовых знаков интерполяции.</li>
 <li>entryComponents - компоненты, которые должны быть скомпилированы вместе с этим компонентом. Для каждого упомянутого здесь компонента создается ComponentFactory и сохраняется в ComponentFactoryResolver.</li>
 <li>preserveWhitespaces - при значении true удаляются потенциально лишние пробелы из скомпилированного шаблона. </li>
 
 <h4>@Directive может содержать следующие параметры:</h4>
  <li>selector - CSS-селектор, который идентифицирует эту директиву в шаблоне и запускает создание этой директивы.</li>
  <li>inputs - свойство для определения значение @Input() параметра. Значение из inputs можно сразу использовать в шаблоне, без объявления переменной в классе. Пример объявления: inputs: ['name', 'id: id-from-parent']. Значение в inputs массиве может состоять из:
    <ul>
      <li> directiveProperty - наименование свойства @Input, которое будет использоваться в дочернем компоненте для вывода в шаблоне и использования в самом классе.
      <li> bindingProperty - наименование свойства, из которого будет производится чтение и запись в directiveProperty. Не обязательное. При отсутсвии параметра значение будет браться из directiveProperty
    </ul>
    Пример использования:

```ts
@Component({
  selector: "child-component",
  template: `Name {{ name }} Id {{ id }}`,
  inputs: ["name", "id: parentId"],
})
export class ChildComponent {}

@Component({
  selector: "parent-component",
  template: `
    <child-component
      [name]="parentName"
      [parentId]="parentIdValue"
    ></child-component>
  `,
})
export class Parent {
  public parentIdValue = "123";
  public parentName = "Name";
}
```

  </li>
  <li>outputs - свойство для определения @Output. В отличии от inputs, объявление свойства в классе обязательно. Пример:

```ts
@Component({
  selector: "child-dir",
  outputs: ["bankNameChange"],
  template: `<input (input)="bankNameChange.emit($event.target.value)" />`,
})
class ChildDir {
  bankNameChange: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
  selector: "main",
  template: `
    {{ bankName }}
    <child-dir (bankNameChange)="onBankNameChange($event)"></child-dir>
  `,
})
class MainComponent {
  bankName: string;

  onBankNameChange(bankName: string) {
    this.bankName = bankName;
  }
}
```

  </li>
  <li>providers - настраивает инжектор этой директивы или компонента с помощью токена.</li>
  <li>exportAs - определяет имя, которое можно использовать в шаблоне для присвоения этой директивы переменной.</li>
  <li>queries - настраивает запросы, которые могут быть инжектированы в директиву.</li>
  <li>host - составляет свойства класса со сбайнженными элементами для свойств, атрибутов и ивентов. </li>
  <li>jit - если true, то этот модуль будет пропущен компилятором AOT и всегда будет компилироваться JIT.</li>
  
  <h4>@Injectable может содержать следующие параметры:</h4>
  <li>providedIn - определяет, где будет заинжектировано, либо, если объявлено "root" распространится на все приложение. </li>
  
  <h4>@Pipe может содержать следующие параметры:</h4>
  <li>name - имя пайпа, которое будет использовано в шаблоне.</li>
  <li>pure - если true, то пайп считается "чистым", и метод transform() вызовется только при изменении его входных агрументов. По умолчанию стоит true. </li>
 
</div>
</details>

<details>
<summary>Что такое динамические компоненты и как их можно использовать в Angular?</summary>
<div>
<br>

  <p>Динамические компоненты - компоненты, которые добавляются на страницу во время выполнения приложения (runtime). Динамические компоненты можно использовать в тех случаях, когда компонент можно отобразить не сразу при загрузке страницы. Например: диалоговые окна, нотификации, контент в табах.</p>
  <p>Для того, чтобы использовать динамические компоненты, необходимо убедиться, что:
    <ol>
      <li> добавлен элемент ("якорь") - ng-container/ng-template - на нужной странице/в шаблоне, куда будет помещен динамический компонент. Именно в этот элемент будет загружаться динамический компонент.</li>
      <li> в классе компонента определено свойство для хранения ng-container/ng-template. Например:

```ts
@Component({
  template: `<div>
    <ng-container #dynamicContent></ng-container>
  </div> `,
})
export class AppComponent {
  @ViewChild("dynamicContent", { read: ViewContainerRef })
  public dynamicContainer: ViewContainerRef;
}
```

  </li>
  <li> при загрузке страницы ng-container/ng-template определен и загружен. Проверить загрузку и определение "якоря" можно в хуке ngAfterViewInit()</li>
  </ol>

  <p>
    В динамический компонент можно внедрить зависимости. Зависимости могут понадобится для общения основного и динамического компонентов. Перед внедрением зависимости нужно создать injector. Создание injector похоже на определение параметра providers в @NgModule. Пример создания Injector:

```ts
// класс, который будет использоваться в constructor
export abstract class IDynamicComponentProps {
  public abstract onClickDynamicComponent(): void;
  public abstract items: Array<string>;
}

// Использование зависимости в динамическом компоненте
@Component({
  template: `
    <span *ngFor='let item of dynamicItems'>{{item}}</span>
    <button (click)='onClick()'></button>
  `
})
export class DynamicComponent {
  public dynamicItems: Array<string> =
    this.dynamicComponentProps.items;
  constructor(
    private dynamicComponentProps: IDynamicComponentProps,
  ) {}

  public onClick(): void {
    this.dynamicComponentProps.onClickDynamicComponent();
  }
}

// Создание инжектора в сервисе или родительском компоненте
@Component({
  ...
})
export class ParentComponent {
  public onClickHandler: EventEmitter<number> = new EventEmitter();
  public parentItems: Array<string> = ['str1', 'str2'];
  constructor(
    private injector: Injector,
  ) {}

  public createInjector() {
    const injector: Injector = Injector.create(
        [
          {
            provide: IDynamicComponentProps,
            useValue:{
              onClickDynamicComponent: () => { this.onClickHandler.emit(0) },
              items: this.parentItems
            }
          }
        ],
        this.injector
      );
  }
}
```

  </p>
  <h4>Последовательность действий для отображения динамического компонента</h4>
  <ol>
    <li> Добавить в шаблон "якорь" для компонента, объявить переменную для работы с этим элементом</li>
    <li> Очистить содержимое динамического компонента (при необходимости)</li>
    <li> Создать ComponentFactory с помощью resolveComponentFactory()</li>
    <li> Вызвать метод из созданного ComponentFactory для создания компонента на странице.</li>
  </ol>
  <p>Примечание: Для динамического компонента не обязательно создавать Injector. Обязательным параметром для метода createComponent является только ComponentFactory.</p>
  <p>Ниже указана последовательность действий, реализованная кодом. В примере используется Основной компонент (MainComponent), динамический компонент (DynamicCompoent) и сервис для рендера (MainComponentService)</p>

```ts
//основной компонент
@Component({
  selector: "main-component",
  template: `<h1>Dynamic Component Example</h1>
    <ng-container #dynamicComponent></ng-container> `,
})
export class MainComponent {
  @ViewChild("dynamicComponent", { read: ViewContainerRef })
  public dynamicContainer: ViewContainerRef;

  public parentItems: Array<string> = ["str1", "str2"];
  constructor(private mainComponentService: MainComponentService) {
    this.mainComponentService.onClickHandler().subscribe((x) => console.log(x));
    // console - 0 form dynamic component
  }

  public ngAfterViewInit(): void {
    this.mainComponentService.render(this.dynamicContainer, this.parentItems);
  }
}

// класс для DI
export abstract class IDynamicComponentProps {
  public abstract onClickDynamicComponent(): void;
  public abstract items: Array<string>;
}

// сервис для рендера
@Injectable()
export class MainComponentService {
  public onClickHandler: EventEmitter<number> = new EventEmitter();
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  public render(container: ViewContainerRef, parentItems: Array<string>): void {
    if (!isUndefined(container)) {
      container.clear();
    }

    const injector: Injector = Injector.create(
      [
        {
          provide: IDynamicComponentProps,
          useValue: {
            onClickDynamicComponent: () => {
              this.onClickHandler.emit(0);
            },
            items: parentItems,
          },
        },
      ],
      this.injector
    );

    const factory =
      this.componentFactoryResolver.resolveComponentFactory(DynamicCompoent);

    container.createComponent(factory, 0, injector);
  }
}

//динамический компонент
@Component({
  template: `
    <span *ngFor="let item of dynamicItems">{{ item }}</span>
    <button (click)="onClick()"></button>
  `,
})
export class DynamicComponent {
  public dynamicItems: Array<string> = this.dynamicComponentProps.items;
  constructor(private dynamicComponentProps: IDynamicComponentProps) {}

  public onClick(): void {
    this.dynamicComponentProps.onClickDynamicComponent();
  }
}
```

</div>
</details>

<details>
<summary>Как применить анимацию к компонентам?</summary>
<div>
<br>

  <p>Анимации в Angular построены на основе функциональности CSS. При работе с анимациями нужно иметь ввиду, что применять анимацию можно только к тем свойствам, которые можно анимировать.</p>
  
  Перед началом создания анимаций нужно:
    <ul>
      <li> Подключить модуль BrowserAnimationsModule в основной модуль приложения (root)</li>
      <li> Подключить функции для анимации в нужном компоненте: 
    </ul>

```js
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from "@angular/animations";
```

<li>Добавить свойство animations в декоратор компонента @Component():</li><br>

```ts
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  animations: [
    // animation triggers go here
  ]
})
```

  <p>
    Анимация состоит из:
    <ol>
      <li>триггера - событие, по которому возникает анимация. Для инициализации триггера используется функция <b>trigger()</b>. В параметрах функции нужно указать событие, которое будет указано в компоненте и к которому будет привязана анимация. Так же, указывается массив из функций <b>state()</b> и <b>transition()</b> </li>
      <li>состояний в конце перехода - стили, которые будут применятся к элементу в конце анимации. Для объявления состояний используется функция <b>state()</b>. В функции нужно указать название состояния, указать стили состояния с помощью функции <b>style()</b>. Если анимация отключена (<b>[@.disabled]='true'</b>), то стили конечных состояний нужно прописать.</li>
      <li>промежуточных состояний - стилей, которые применяются к элементу между окончательными состояниями. С помощью промежуточных состояний можно анимировать переходы. Для этого используется функция <b>transition()</b>. В функции нужно прописать выражение, в котором указано направление между состояниями и функции для определения стилей между состояниями, анимации.</li>
    </ol>

  <p>Для объявления триггера, нужно прописать функцию <b>trigger()</b> в метаданных компонента, в свойстве <b>animations</b>. Первым параметром нужно указать событие, которое будет привязано в шаблоне к элементу. Вторым параметром нужно указать состояние <b>state()</b> и анимации в <b>transition()</b>. Например:

```ts
@Component({
  selector: "example",
  animations: [
    trigger("toggle", [
      state(
        "open",
        style({
          height: "200px",
          opacity: 1,
          backgroundColor: "yellow",
        })
      ),
      state(
        "closed",
        style({
          height: "100px",
          opacity: 0.5,
          backgroundColor: "green",
        })
      ),
      transition("open => closed", [animate("1s")]),
      transition("closed => open", [animate("0.5s")]),
      //...
    ]),
  ],
  template: `<div [@toggle]="isOpen ? 'open' : 'closed'"></div>`,
})
export class ExampleComponent {}
```

  </p>
  <h4>Дополнительные состояния переходов</h4>
  <p>При работе с переходами можно указывать не только состояния, указанные в функции state(). Анимации в Angular поддерживают следующие состояния:
    <ul>
      <li><b>*</b> - любое состояние. Полезно для определения переходов, которые применяются независимо от начального или конечного состояния HTML-элемента. Можно использовать конструкцию <b>* => *</b>, для того, чтобы определить переходы тем состояниям, у которых не назначена анимация. Эту конструкцию можно добавить после того, как будут перечислены конкретные переходы состояний.</li>
      <li><b>void</b> - состояние, когда элемент появляется в DOM или удаляется из него. Например, при ngIf. Void входит в состояние *. </li>
    </ul>

```ts
animations: [
  trigger("openClose", [
    state(
      "open",
      style({
        height: "200px",
        opacity: 1,
        backgroundColor: "yellow",
      })
    ),
    state(
      "closed",
      style({
        height: "100px",
        opacity: 0.5,
        backgroundColor: "green",
      })
    ),
    transition("open => closed", [animate("1s")]),
    transition("closed => open", [animate("0.5s")]),
    transition("* => closed", [animate("1s")]),
    transition("* => open", [animate("0.5s")]),
    transition("* => open", [animate("1s", style({ opacity: "*" }))]),
    transition("* => *", [animate("1s")]),
  ]),
];
```

<p>
    Два вышеперечисленных состояния можно использовать вместе - <b>void => *</b> и <b> * => void</b>. У этих конструкций есть алиасы - :enter (void => *) и :leave (* => void). Например:
</p>

```ts
const animation = trigger("eventTrigger", [
  transition("void => *", [
    style({ opacity: 0 }),
    animate("5s", style({ opacity: 1 })),
  ]),
  // or
  transition(":enter", [
    style({ opacity: 0 }),
    animate("5s", style({ opacity: 1 })),
  ]),

  //-------------//

  transition("* => void", [animate("5s", style({ opacity: 0 }))]),
  //or
  transition(":leave", [animate("5s", style({ opacity: 0 }))]),
]);
```

  <p>Для работы с переходами можно использовать числовые и булевы значения. При работе с числовыми значениями, можно использовать алиасы :increment и :decrement. С булевыми значениями можно просто прописать true/false. Например:

```ts
@Component({
  selector: "toggle",
  animations: [
    trigger("isOpen", [
      state("true", style({ height: "*" })),
      state("false", style({ height: "0px" })),
      transition("true <=> false", [animate("1s")]),
    ]),
  ],
  template: `<div [@isOpen]="isOpen ? true : false"></div>`,
})
export class ToggleComponent {
  public isOpen: boolean = true;
}

@Component({
  template: `<ul class="heroes" [@filterAnimation]="heroTotal"></ul>`,
  animations: [
    trigger("filterAnimation", [
      transition(":enter, * => 0, * => -1", []),
      transition(":increment", [
        query(
          ":enter",
          [
            style({ opacity: 0, width: "0px" }),
            stagger(50, [
              animate("300ms ease-out", style({ opacity: 1, width: "*" })),
            ]),
          ],
          { optional: true }
        ),
      ]),
      transition(":decrement", [
        query(":leave", [
          stagger(50, [
            animate("300ms ease-out", style({ opacity: 0, width: "0px" })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class HeroListPageComponent implements OnInit {
  public heroTotal: number = -1;
}
```

  </p>
  
<p><b>Примечание:</b> хорошей практикой является перенос анимаций в отдельные файлы *.animation.ts. Эта практика уменьшит размер файла компонента, обеспечит декомпозицию, даст возможность переиспользования анимаций.</p>
  
[Гайд ангуляра по переиспользованию анимаций](https://angular.io/guide/reusable-animations)

<h4>Отключение анимации</h4>
<p>Анимацию можно принудительно отключить как в отдельном компоненте, так и во всем приложении.</p>
<p>Для отключения анимации в компоненте нужно указать [@.disabled]='isDisabled' в нужной ноде компонента. Например:

```html
<div [@.disabled]="isDisabled"></div>
```

</p>

<p>Для отключения анимации во всем приложении, нужно указать @HostBinding('@.disabled') в корневом компоненте. Например:

```ts
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  animations: [
    // animation  go here
  ],
})
export class AppComponent {
  @HostBinding("@.disabled")
  public animationsDisabled = true;
}
```

  </p>
  <h4>Дополнительная функциональность для анимаций</h4>
  <p>Можно указывать конкретные значения стилей в определенный промежуток времени с помощью <b>keyframes()</b></p>
  <p>Есть возможность запускать анимации параллельно, указав их в функции <b>group()</b>. Запускать последовательно с помощью функции <b>sequence()</b>.</p>
  <p>Анимацию можно применять к конкретному селектору, который можно указать в параметрах фукнции <b>query()</b>. Так же. можно управлять анимациями дочерних элементов с помощью <b>animateChild()</b> (только для анимаций, описанных с помощью Angular)</p>
</div>
</details>

##### Angular render lifecycle and core environments

<details>
<summary>Объясните механизм загрузки (bootstrap) Angular-приложения в браузере?</summary>
<div>
<br>
<p>Запуск Angular приложения начинается с файла <b>main.ts</b>. Этот файл содержит в себе примерно следующее:</p>

```ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);
```

<p>platformBrowserDynamic запускает AppModule. После этого, начинает работать логика в AppModule. </p>
<p>В AppModule обычно задается компонент, который будет использоваться для отображения при загрузке. Компонент находится в параметре <b>bootstrap</b></p>

```ts
@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

</div>
</details>

<details>
<summary>Как происходит взаимодействие компонентов в Angular (опишите components view)?</summary>
<br>

<div>
  <p>Взаимодействие компонентов может быть: </p>
  <ul>
    <li><b>между родительским и дочерним компонентом</b> - селектор одного компонента объявлен в шаблоне другого</li>
    <li><b>между компонентами одного уровня</b> - селекторы компонентов не вложенные</li>
  </ul>
  <p></p>
  <h4>Способы взаимодействия</h4>
  <ol>
    <li>
      <p><b>@Input()/@Output() декораторы свойств</b> - используются между дочерним и родительским компонентами. В @Input() можно получить значение из родителя. Через @Output() отправить данные из дочернего в родительский компонент.</p>
      <p>В шаблоне родительского компонента ставится селектор дочернего. В селекторе дочернего компонента прописываются атрибуты, через которые будут передаваться данные в переменные @Input()/@Output(). Для обозначения @Input свойства в селекторе нужно прописать <child [title]='parentTitle'></child>. Для обозначения @Output свойства в селекторе нужно прописать <child (getChanges)='onGetChanges($event)'></child>.</p>
      <p>В классе родительского компонента нужно обозначить public свойства/методы, которые будут прописаны в атрибутах дочернего селектора.</p>
      <p>В классе дочернего компонента нужно прописать public свойства с декораторами @Input()/@Output(). Названия свойств должны совпадать с именами в атрибутах дочернего селектора. В @Input() можно передать значения как обычных типов данных (string, number, Array и тп), так и потоки (Subject, Observable). В @Output обычно используется EventEmitter. Через него можно отправить значения в функцию родительского компонента, которая прописана в атрибуте селектора.</p>
      <p>Пример</p>

```ts
@Component({
  selector: "parent",
  template: `
    <div>
      <child [count]="value" (increment)="onInstement($event)"></child>
    </div>
  `,
})
export class ParentComponent {
  public value: number = 0;

  public onIncrement(value: number): void {
    // actions with child's value
  }
}

@Component({
  selector: "child",
  template: `
    <div>
      <button type="button" (click)="onClickIncrement()">+1</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush, //см пункт "Какие существуют стратегии обнаружения изменений?"
})
export class ChildComponent {
  @Input() public count: number;

  @Output() public increment: EventEmitter<number> = new EventEmitter();

  public onClickIncrement(): void {
    const result = this.count++;
    this.increment.emit(result);
  }
}
```

  </li>
  <li>
    <p><b>@ViewChild() директива</b> - получение доступа к свойствам дочернего компонента. В родительском шаблоне нужно указать селектор дочернего. Так же, в родительском компоненте нужно обозначить public свойство с директивой @ViewChild().</p>
    <p>По умолчанию, доступ к свойствам @ViewChild() можно получить в хуке ngAfterViewInit(). Так же, нужно учитывать свойство <b>static</b> при использовании @ViewChild(). <b>static</b> параметр указывает, когда можно получить доступ к ViewChild() - до или после change detection. Это может понадобится, когда @ViewChild используется в циклах (*ngFor) или доступен только по условию (*ngIf). Если static = false, то доступ можно получить до change detection в хуке ngAfterViewInit(). </p>
    <p>Примеры</p>

```ts
@Component({
  selector: "parent",
  template: `<child #childRef *ngIf="isShowChild"></child>`,
})
export class ParentComponent {
  @ViewChild("childRef", { static: false }) public viewChild: ChildComponent;

  public isShowChild: boolean = false;

  public ngAfterViewInit(): void {
    console.log(this.viewChild.title);
  }
}

@Component({
  selector: "parent",
  template: `<child #childRef></child>`,
})
export class ParentComponent {
  @ViewChild("childRef", { static: false }) public viewChild: ChildComponent;

  public ngAfterViewInit(): void {
    console.log(this.viewChild.title);
  }
}
```

  </li>
  <li>
    <p><b>Через сервис</b> - передача данных между компонентами через единый сервис. Этим способом можно взаимодействовать с компонентами одного уровня. Так же, можно избавиться от иерархии зависимостей и не использовать всплывающие события (Output)</p>
    <p>Необходимо создать общий сервис, который объявляется в параметре providers в общем модуле соединяемых компонентов. В сервисе можно создать public свойства и методы для передачи данных. Можно использовать Observable и Subjects для передачи данных. Пример:</p>

```ts
@Injectable()
export class CountService {
  private count$: BehaviorSubject<number> = new BehaviorSubject(0);

  public get value$(): Observable<number> {
    return this.count$.asObservable();
  }

  public get value(): number {
    return this.count$.getValue();
  }

  public setState(value: number): void {
    this.count$.next(value);
  }

  public reset(): void {
    this.count$.next(0);
  }
}

@Component({
  selector: "counter",
  template: `
     value = {{ counter.value$ | async }}  <br/>
    <button type='button' (click)='counter.setState(counter.value + 1)>+1</button>
    <button type='button' (click)='counter.setState(counter.value - 1)>-1</button>
    <button type='reset' (click)='counter.reset()>reset</button>
  `,
})
export class CounterComponent {
  constructor(private counter: CountService) {}
}
```

  </li>
  </ol>
</div>
</details>

<details>
<summary>Каков жизненный цикл у компонентов?</summary>
<div>
<br>

<b>После</b> создания компонента или директивы через вызов конструктора, Angular вызывает методы жизненного цикла в следующей последовательности в строго определенные моменты:

  <li>ngOnChanges() - вызывается когда Angular переприсваивает привязанные данные к input properties. Метод получает объект SimpleChanges, со старыми и новыми значениями. Вызывается перед NgOnInit и каждый раз, когда изменяется одно или несколько связанных свойств.</li>
  <li>ngOnInit() - инициализирует директиву/компонент после того, как Angular впервые отобразит связанные свойства и устанавливает входящие параметры.</li>
  <li>ngDoCheck() - при обнаружении изменений, которые Angular не может самостоятельно обнаружить, реагирует на них. </li>
  <li>ngAfterContentInit() - вызывается после того, как Angular спроецирует внешний контент в отображение компонента или отображение с директивой. Вызывается единожды, после первого ngDoCheck().</li>
  <li>ngAfterContentChecked() - реагирует на проверку Angular-ом проецируемого содержимого. Вызывается после ngAfterContentInit() и каждый последующий ngDoCheck().</li>
  <li>ngAfterViewInit() - вызывается после инициализации отображения компонента и дочерних/директив. Вызывается единожды, после первого ngAfterContentChecked().</li>
  <li>ngAfterViewChecked() - реагирует на проверку отображения компонента и дочерних/директив. Вызывается после ngAfterViewInit() и каждый последующий ngAfterContentChecked().</li>
  <li>ngOnDestroy() - после уничтожения директивы/компонента выполняется очистка. Отписывает Observables и отключает обработчики событий, чтобы избежать утечек памяти.</li>
  
</div>
</details>

<details>
<summary>Что такое Shadow DOM и как с ним работать в Angular?</summary>
<div>
  **Shadow DOM** - это веб-стандарт, который позволяет инкапсулировать структуру DOM, стили и поведение компонента, скрывая их от остальной части документа. Это создает изолированную область DOM для компонента.

**Основные характеристики Shadow DOM:**

- Изоляция DOM: элементы внутри Shadow DOM не доступны через обычные DOM-селекторы снаружи
- Изоляция стилей: CSS-правила из внешнего документа не влияют на Shadow DOM и наоборот
- Слоты (slots): механизм для проецирования контента из основного документа в Shadow DOM

**Работа с Shadow DOM в Angular:**

1. **Включение Shadow DOM для компонента:**

```typescript
@Component({
  selector: "app-my-component",
  templateUrl: "./my-component.component.html",
  styleUrls: ["./my-component.component.css"],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MyComponent {
  // ...
}
```

2. **Варианты инкапсуляции в Angular:**

   - `ViewEncapsulation.None` - стили применяются глобально
   - `ViewEncapsulation.Emulated` (по умолчанию) - эмуляция инкапсуляции стилей
   - `ViewEncapsulation.ShadowDom` - использование нативного Shadow DOM

3. **Использование слотов (content projection):**

```html
<!-- my-component.component.html -->
<div class="shadow-container">
  <h2>Заголовок компонента</h2>
  <div class="content">
    <slot></slot>
    <!-- Базовый слот -->
    <slot name="footer"></slot>
    <!-- Именованный слот -->
  </div>
</div>

<!-- Использование компонента -->
<app-my-component>
  <p>Этот контент попадет в базовый слот</p>
  <div slot="footer">Этот контент попадет в слот "footer"</div>
</app-my-component>
```

4. **Доступ к элементам в Shadow DOM:**

```typescript
@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MyComponent implements AfterViewInit {
  @ViewChild("myButton") myButton: ElementRef;

  ngAfterViewInit() {
    // Доступ к элементу в Shadow DOM
    const button = this.myButton.nativeElement;
  }
}
```

**Преимущества Shadow DOM в Angular:**

- Лучшая инкапсуляция: предотвращает конфликты стилей
- Более чистый DOM: скрывает внутреннюю структуру компонента
- Самодостаточность: компоненты можно использовать в разных контекстах

**Ограничения:**

- Поддержка браузерами (хотя современные браузеры поддерживают)
- Увеличение сложности при взаимодействии между компонентами
- Инструменты разработчика могут быть сложнее в использовании
</div>
</details>

<details>
<summary>Что такое Data Binding и какие проблемы связанные с ним вы знаете?</summary>
<br>

<div>
  Angular поддерживает одностороннюю и двустороннюю Data Binding. Это механизм координации частей шаблона с частями компонента. 
  <br>Добавление специальной разметки сообщает Angular как соединять обе стороны. Следующая диаграмма показывает четыре формы привязки данных.
  <br>Односторонние:
  <li>От компонента к DOM с привязкой значения: {{hero.name}}</li>
  <li>От компонента к DOM с привязкой свойства и присвоением значения: [hero]="selectedHero"</li>
  <li>От DOM к компоненту с привязкой на ивент: (click)="selectHero(hero)"</li>
  
  <br>Двусторонняя в основном используется в template-driven forms, сочетает в себе параметр и ивент. Вот пример, использующий привязку с директивой ngModel.
  
  ```html
    <input [(ngModel)]="hero.name">
  ```
  <br>Здесь значение попадает в input из компонента, как при привязке значения, но при изменении юзером значения новое передается в компонент и переопределяется. 
 
</div>
</details>

<details>
<summary>27. Как вы используете одностороннюю и двухстороннюю привязку данных?</summary>

**Привязка данных** в Angular - это механизм, который позволяет синхронизировать данные между классом компонента и его шаблоном.

**1. Односторонняя привязка данных (One-way binding):**
Данные передаются только в одном направлении - от компонента к шаблону или от шаблона к компоненту.

**Виды односторонней привязки:**

а) **Интерполяция** (от компонента к шаблону):

```html
<h1>Привет, {{ userName }}!</h1>
<p>Сумма: {{ 1 + 1 }}</p>
<div>Статус: {{ isActive ? 'Активен' : 'Неактивен' }}</div>
```

б) **Привязка свойств** (от компонента к шаблону):

```html
<img [src]="userImageUrl" [alt]="userName" />
<button [disabled]="isSubmitting">Отправить</button>
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">Содержимое</div>
```

в) **Привязка событий** (от шаблона к компоненту):

```html
<button (click)="onSubmit()">Отправить</button>
<input (keyup)="onKeyUp($event)" (blur)="onBlur()" />
<div (mouseenter)="showTooltip()" (mouseleave)="hideTooltip()">
  Наведите курсор
</div>
```

**2. Двухсторонняя привязка данных (Two-way binding):**
Данные синхронизируются в обоих направлениях между компонентом и шаблоном. Используется директива `ngModel`.

```html
<!-- Требуется FormsModule в импортах модуля -->
<input [(ngModel)]="userName" placeholder="Введите имя" />
<textarea [(ngModel)]="description"></textarea>
```

**Реализация собственной двусторонней привязки:**

```typescript
// Компонент
@Component({
  selector: 'app-counter',
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <span>{{ value }}</span>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  increment() {
    this.value++;
    this.valueChange.emit(this.value);
  }

  decrement() {
    this.value--;
    this.valueChange.emit(this.value);
  }
}

// Использование
<app-counter [(value)]="counterValue"></app-counter>
```

**Когда использовать разные типы привязки:**

1. **Односторонняя привязка** (компонент → шаблон):

   - Для отображения данных, которые не должны изменяться пользователем
   - Когда нужно просто показать значение из компонента
   - Для управления атрибутами и свойствами HTML-элементов

2. **Односторонняя привязка** (шаблон → компонент):

   - Для обработки пользовательских действий и событий
   - Когда нужно вызвать метод компонента по действию пользователя

3. **Двухсторонняя привязка**:
   - Для форм ввода данных
   - Когда нужно мгновенно отражать изменения в обоих направлениях
   - Для компонентов, где пользователь редактирует данные

**Лучшие практики:**

- Предпочитайте одностороннюю привязку, когда это возможно (для лучшей производительности)
- Используйте двухстороннюю привязку осознанно для полей форм и пользовательского ввода
- Старайтесь минимизировать сложность привязок в шаблонах
</details>

<details>
<summary>28. В чем преимущества и недостатки Regular DOM перед Virtual DOM?</summary>

**Regular DOM (Document Object Model)** - это программный интерфейс для HTML и XML-документов, который представляет страницу как древовидную структуру узлов, позволяющую JavaScript взаимодействовать с HTML-элементами.

**Virtual DOM** - это концепция программирования, при которой "виртуальное" представление пользовательского интерфейса хранится в памяти и синхронизируется с "реальным" DOM с помощью библиотеки, например React.

**Сравнение Regular DOM и Virtual DOM:**

**Преимущества Regular DOM:**

1. **Прямой доступ к элементам**: непосредственное взаимодействие с DOM-элементами через API браузера
2. **Нет дополнительного слоя абстракции**: работа без промежуточного уровня, что в некоторых случаях может быть проще
3. **Более эффективен для редких обновлений**: если интерфейс обновляется редко, непосредственные манипуляции с DOM могут быть эффективнее
4. **Нативная поддержка браузером**: не требует дополнительных библиотек
5. **Больше контроля над оптимизацией**: возможность тонко оптимизировать отдельные операции с DOM

**Недостатки Regular DOM:**

1. **Производительность при частых обновлениях**: прямые манипуляции с DOM могут быть медленными при множественных обновлениях
2. **Перерисовка всей страницы**: изменение одного элемента может вызвать перерисовку большой части страницы
3. **Сложность управления состоянием**: требуется больше кода для отслеживания и синхронизации изменений
4. **Императивный подход**: необходимо явно указывать, как именно изменить DOM
5. **Риск утечек памяти**: при частом добавлении/удалении обработчиков событий

**Angular и работа с DOM:**

Angular использует свой подход к обновлению DOM, который отличается как от прямой работы с Regular DOM, так и от Virtual DOM:

1. **Change Detection (Обнаружение изменений)**: Angular отслеживает изменения данных и обновляет только те части DOM, которые связаны с измененными данными.

2. **Zone.js**: отслеживает асинхронные операции для автоматического запуска обнаружения изменений.

3. **AOT-компиляция**: компилирует шаблоны Angular в оптимизированный JavaScript на этапе сборки.

4. **Incremental DOM**: Angular использует подход, при котором инструкции для обновления DOM создаются во время компиляции, что минимизирует использование памяти.

**Когда предпочтительнее Regular DOM:**

- Для простых интерфейсов с минимальными обновлениями
- Когда требуется максимальный контроль над DOM-операциями
- В проектах, где важна минимальная загрузка библиотек

**Когда предпочтительнее подход Angular:**

- Для сложных приложений с множеством взаимодействий
- Когда важно декларативное описание UI
- При разработке крупных корпоративных приложений
- Когда необходима хорошая организация кода и архитектуры
</details>

<details>
<summary>Что такое ngZone?</summary>
<div>
  <br>

<a href="https://angular.io/api/core/NgZone">NgZone</a> - это сервис, который является обёрткой над zone.js, для выполнения кода внутри или вне зоны Angular. Этот сервис создаёт зону с именем angular для автоматического запуска обнаружения изменений, когда выполняются следующие условия:

  <li>Когда выполняется синхронная или асинхронная функция</li>
  <li>Когда нет запланированной микро-задачи в очереди</li>

<br>Наиболее распространённое применение NgZone — это оптимизация производительности посредством выполнения асинхронной логики вне зоны Angular (метод <code>runOutsideAngular</code>), тем самым не вызывая обнаружение изменений или обработку ошибок. Или наоборот, данный сервис может использоваться для выполнения логики внутри зоны (метод <code>run</code>), что в конечном итоге приведёт к тому, что Angular снова вызовет обнаружение изменений и при необходимости перерисует представление.

</div>
</details>

<details>
<summary>Как обновлять представление, если ваша модель данных обновляется вне 'зоны'?</summary>
<br>

1. Используя метод `ApplicationRef.prototype.tick`, который запустит `change detection` на всем дереве компонентов.

```ts
import { Component, ApplicationRef, NgZone } from "@angular/core";

@Component({
  selector: "app-root",
  template: ` <h1>Hello, {{ name }}!</h1> `,
})
export class AppComponent {
  public name: string = null;

  constructor(private app: ApplicationRef, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.name = window.prompt("What is your name?", "Jake");
        this.app.tick();
      }, 5000);
    });
  }
}
```

2. Используя метод `NgZone.prototype.run`, который также запустит `change detection` на всем дереве.

```ts
import { Component, NgZone } from "@angular/core";
import { SomeService } from "./some.service";

@Component({
  selector: "app-root",
  template: ` <h1>Hello, {{ name }}!</h1> `,
  providers: [SomeService],
})
export class AppComponent {
  public name: string = null;

  constructor(private zone: NgZone, private service: SomeService) {
    this.zone.runOutsideAngular(() => {
      this.service.getName().then((name: string) => {
        this.zone.run(() => (this.name = name));
      });
    });
  }
}
```

Метод `run` под капотом сам вызывает `tick`, а параметром принимает функцию, которую нужно выполнить перед `tick`. То есть:

```ts
this.zone.run(() => (this.name = name));

// идентично

this.name = name;
this.app.tick();
```

3. Используя метод `ChangeDetectorRef.prototype.detectChanges`, который запустит `change detection` на текущем компоненте и дочерних.

```ts
import { Component, NgZone, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-root",
  template: ` <h1>Hello, {{ name }}!</h1> `,
})
export class AppComponent {
  public name: string = null;

  constructor(private zone: NgZone, private ref: ChangeDetectorRef) {
    this.zone.runOutsideAngular(() => {
      this.name = window.prompt("What is your name?", "Jake");
      this.ref.detectChanges();
    });
  }
}
```

</details>

<details>
<summary>Что такое EventEmitter и как подписываться на события?</summary>
<div>
<br>
Используется в директивах и компонентах для подписки на пользовательские ивенты синхронно или асинхронно, и регистрации обработчиков для этих ивентов.
</div>
</details>

<details>
<summary>Что такое Change Detection, как работает Change Detection Mechanism?</summary>

<h4>1. Change Detection</h4>
  
Change Detection - процесс синхронизации модели с представлением. В Angular поток информации однонаправленный, даже при использовании `ngModel` для реализации двустороннего связывания, которая является синтаксическим сахаром поверх однонаправленного потока.

<h4>2. Change Detection Mechanism </h4>

Change Detection Mechanism - продвигается только вперед и никогда не оглядывается назад, начиная с корневого (рут) компонента до последнего. В этом и есть смысл одностороннего потока данных. Архитектура Angular приложения очень проста — дерево компонентов. Каждый компонент указывает на дочерний, но дочерний не указывает на родительский. Односторонний поток устраняет необходимость `$digest` цикла.

<br>
</details>

<details>
<summary>Какие существуют стратегии обнаружения изменений?</summary>
<br>

Всего есть две стратегии - `Default` и `OnPush`. Если все компоненты используют первую стратегию, то `Zone` проверяет все дерево независимо от того, где произошло изменение. Чтобы сообщить Angular, что мы будем соблюдать условия повышения производительности нужно использовать стратегию обнаружения изменений `OnPush`. Это сообщит Angular, что наш компонент зависит только от входных данных и любой объект, который передается ему должен считаться immutable. Это все построено на принципе автомата Мили, где текущее состояние зависит только от входных значений.

<br>

</details>

<details>
<summary>Сколько Change Detector(ов) может быть во всем приложении?</summary>
<br>
У каждого компонента есть свой Change Detector, все Change Detector(ы) наследуются от AbstractChangeDetector.  
<br>
</details>

<details>
<summary>Основное отличие constructor от ngOnInit?</summary>
<br>
  
Конструктор сам по себе является фичей самого класса, а не Angular. Основная разница в том, что Angular запустит `ngOnInit`, после того, как закончит настройку компонента, то есть, это сигнал, благодаря которому свойства `@Input()` и другие байндинги, и декорируемые свойства доступны в `ngOnInit`, но не определены внутри конструктора, по дизайну.

<br>
</details>

##### RxJS

<details>
<summary>Для чего нужен RxJS и какую проблему он решает?</summary>
<div>
**RxJS (Reactive Extensions for JavaScript)** - это библиотека для реактивного программирования с использованием наблюдаемых объектов (Observables), которая упрощает работу с асинхронными операциями и событиями.

**Основные проблемы, которые решает RxJS:**

1. **Усложнение асинхронного кода**:

   - "Callback hell" - вложенные колбэки делают код трудночитаемым
   - Сложность обработки ошибок в асинхронных операциях
   - Трудности с отменой выполнения асинхронных операций

2. **Разрозненные API для разных источников данных**:

   - События DOM, HTTP-запросы, WebSockets имеют разные API
   - Отсутствие единого подхода к обработке потоков данных

3. **Управление состоянием и реактивность**:
   - Сложность отслеживания изменений данных
   - Синхронизация состояния между разными частями приложения

**Ключевые концепции RxJS:**

1. **Observable** - поток данных, который может испускать несколько значений с течением времени

```typescript
import { Observable } from "rxjs";

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.complete();
  }, 1000);
});

observable.subscribe({
  next: (value) => console.log("Получено:", value),
  error: (err) => console.error("Ошибка:", err),
  complete: () => console.log("Выполнено"),
});
```

2. **Операторы** - функции для трансформации, фильтрации и комбинирования Observable

```typescript
import { of, map, filter } from "rxjs";

of(1, 2, 3, 4, 5)
  .pipe(
    filter((n) => n % 2 === 0),
    map((n) => n * 2)
  )
  .subscribe((value) => console.log(value)); // Выведет: 4, 8
```

3. **Subject** - специальный тип Observable, который является и Observer, и Observable одновременно

```typescript
import { Subject } from "rxjs";

const subject = new Subject<number>();

subject.subscribe((value) => console.log(`Подписчик A: ${value}`));
subject.next(1); // Подписчик A: 1

subject.subscribe((value) => console.log(`Подписчик B: ${value}`));
subject.next(2); // Подписчик A: 2, Подписчик B: 2
```

**Применение RxJS в Angular:**

1. **HTTP-запросы**:

```typescript
import { HttpClient } from "@angular/common/http";
import { catchError, retry } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<any[]>("/api/data").pipe(
      retry(3),
      catchError((error) =>
        throwError(() => new Error("Ошибка при загрузке данных"))
      )
    );
  }
}
```

2. **Управление пользовательским вводом**:

```typescript
import { fromEvent, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({...})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search(value);
    });
  }
}
```

3. **Отмена запросов**:

```typescript
import { Subject, takeUntil } from 'rxjs';

@Component({...})
export class UserComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Преимущества использования RxJS:**

1. **Декларативный подход** - описание того, что должно произойти, а не пошаговых инструкций
2. **Единый API** для работы с любыми асинхронными операциями
3. **Комбинирование потоков данных** с помощью операторов
4. **Управление потоком данных** - фильтрация, трансформация, объединение
5. **Эффективная отмена подписок** и предотвращение утечек памяти
6. **Обработка ошибок** на любом этапе потока данных
</div>
</details>

<details>
<summary>Что такое Observable?</summary>
<div>
  <br>Observable— это наблюдатель, который подписывается и реагирует на все события до момента отписки. 
</div>
</details>

<details>
<summary>В чём разница между Observable и Promise?</summary>
<div>
 <br>
 <p>Promise обрабатывает одно значение по завершению асинхронной операции, вне зависимости от ее исхода, и не поддерживают отмену операции.</p>
 <p>Observable же является потоком, и позволяет передавать как ноль, так и несколько событий, когда callback вызывается для каждого события.</p>
</div>
</details>

<details>
<summary>В чём разница между Observable и BehaviorSubject/Subject (Higher Order Observables)?</summary>
<div>
<br>

<p>Subjects - специальные Observable. Представьте, что есть спикер с микрофоном, который выступает в комнате, полной людей. 
Это и есть Subjects, их сообщение передается сразу нескольким получателям. Обычные же Observables можно сравнить с разговором 1 на 1.</p>

<ul>
    <li>Subject - является multicast, то есть может передавать значение сразу нескольким подписчикам.</li>
    <li>BehaviorSubject - требует начальное значение и передает текущее значение новым подпискам.</li>
</ul>
</div>
</details>

<details>
<summary>В чем разница между Subject, BehaviorSubject, ReplaySubject, AsyncSubject?</summary>
<div>
  <br>

  <ul>
    <li>Subject - не хранит свои предыдущие состояния, зритель получает информацию только тогда, когда Subject сгенерирует новое событие, используя метод <code>.next()</code>.</li>
    <li>BehaviorSubject - при подписке поведенческий Subject уведомляет своего зрителя о последнем произошедшем в нём событии или, если в Subject-е не происходило событий, создаёт для зрителя событие с изначальной информацией, которая передаётся при создании Subject-а.</li>
    <li>ReplaySubject - при подписке повторяющийся Subject уведомляет своего нового зрителя о всех произошедшем в нём событиях с момента создания. Для оптимизации при создании повторяющегося Subject-а можно передать число последних событий, которые будут повторяться для каждого нового зрителя. Стоит отметить, что создание ReplaySubject-а c числом повторяющихся событий равное 1 эквивалетно созданию BehaviorSubject-а.</li>
    <li>AsyncSubject - асинхронный Subject уведомляет своих зрителей только о последнем произошедшем событии и только когда Subject успешно завершается. Если AsyncSubject завершится ошибкой, его зрители будут уведомлены только об ошибке.
    </li>
  </ul>
</div>
</details>

<details>
<summary>В чём разница между операторами switchMap, mergeMap, concatMap?</summary>
<div>
  <br>
  <ul>  
      <li>switchMap - отменит подписку на Observable, возвращенный ее аргументом project, как только он снова вызовет ее в новом элементе.</li>
      <li>mergeMap - в отличие от switchMap позволяет реализовать одновременно несколько внутренних подписок. </li>
      <li>concatMap - последовательно обрабатывает каждое событие, в отличие от mergeMap.</li>
  </ul>
</div>
</details>

<details>
<summary>Как бы вы кешировали наблюдаемые данные из потоков (stream)?</summary>
<div>
 Кеширование данных из Observable потоков в Angular помогает улучшить производительность приложения, сократить количество HTTP-запросов и улучшить пользовательский опыт. Вот наиболее эффективные стратегии кеширования:

**1. Использование оператора `shareReplay`:**

Простой и эффективный способ кеширования результатов Observable:

```typescript
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private usersCache$: Observable<User[]>;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get<User[]>("/api/users").pipe(
        shareReplay(1) // Кеширует последний эмитированный результат
      );
    }
    return this.usersCache$;
  }
}
```

`shareReplay(1)` сохраняет последнее значение и передает его всем новым подписчикам.

**2. Временное кеширование с инвалидацией:**

```typescript
@Injectable({
  providedIn: "root",
})
export class CachingService {
  private cache = new Map<
    string,
    {
      data: any;
      timestamp: number;
    }
  >();
  private cacheDuration = 5 * 60 * 1000; // 5 минут

  constructor(private http: HttpClient) {}

  getData<T>(url: string): Observable<T> {
    const cachedData = this.cache.get(url);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < this.cacheDuration) {
      return of(cachedData.data);
    } else {
      return this.http.get<T>(url).pipe(
        tap((data) => {
          this.cache.set(url, {
            data,
            timestamp: now,
          });
        })
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(url: string): void {
    this.cache.delete(url);
  }
}
```

**3. Использование RxJS `ReplaySubject`:**

```typescript
@Injectable({
  providedIn: "root",
})
export class DataService {
  private dataSubject = new ReplaySubject<Data[]>(1);
  private isLoading = false;

  constructor(private http: HttpClient) {}

  getData(): Observable<Data[]> {
    if (!this.isLoading) {
      this.isLoading = true;
      this.http
        .get<Data[]>("/api/data")
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (data) => this.dataSubject.next(data),
          (error) => this.dataSubject.error(error)
        );
    }
    return this.dataSubject.asObservable();
  }

  refreshData(): void {
    this.isLoading = true;
    this.http.get<Data[]>("/api/data").subscribe(
      (data) => {
        this.dataSubject.next(data);
        this.isLoading = false;
      },
      (error) => {
        this.dataSubject.error(error);
        this.isLoading = false;
      }
    );
  }
}
```

**4. Кеширование с параметризованными запросами:**

```typescript
@Injectable({
  providedIn: "root",
})
export class ProductService {
  private cache = new Map<string, Observable<Product[]>>();

  constructor(private http: HttpClient) {}

  getProducts(category: string, page: number): Observable<Product[]> {
    const key = `${category}-${page}`;

    if (!this.cache.has(key)) {
      const request = this.http
        .get<Product[]>(`/api/products?category=${category}&page=${page}`)
        .pipe(
          shareReplay(1),
          timeout(10000), // Таймаут для запроса
          catchError((error) => {
            this.cache.delete(key); // Удаляем из кеша при ошибке
            return throwError(error);
          })
        );

      this.cache.set(key, request);
    }

    return this.cache.get(key);
  }
}
```

**5. Продвинутое кеширование с NgRx:**

```typescript
// В эффектах NgRx
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      concatLatestFrom(() => this.store.select(selectCachedProducts)),
      switchMap(([action, cachedProducts]) => {
        // Проверяем, есть ли уже закешированные данные
        if (cachedProducts && cachedProducts.length > 0) {
          return of(loadProductsSuccess({ products: cachedProducts }));
        }

        return this.productService.getProducts().pipe(
          map((products) => loadProductsSuccess({ products })),
          catchError((error) => of(loadProductsFailure({ error })))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private productService: ProductService
  ) {}
}
```

**Лучшие практики кеширования Observable:**

1. **Добавьте инвалидацию кеша** - возможность очистить кеш при критических изменениях данных
2. **Реализуйте стратегию истечения срока** - автоматическое обновление данных после истечения определенного времени
3. **Используйте в кеше идентификаторы с параметрами** - для правильного кеширования запросов с разными параметрами
4. **Обрабатывайте ошибки** - удаляйте данные из кеша при ошибках, чтобы повторить запрос при следующей подписке
5. **Реализуйте стратегию предварительной загрузки** - загружайте данные заранее для улучшения UX
6. **Учитывайте ограничения памяти** - следите за размером кеша, особенно при хранении больших объектов
</div>
</details>

##### Angular data flow

<details>
<summary>Что такое Dependency Injection?</summary>
<div>
<br>Это важный паттерн шаблон проектирования приложений. В Angular внедрение зависимостей реализовано из-под капота.<br>
<br>Зависимости - это сервисы или объекты, которые нужны классу для выполнения своих функций. DI -позволяет запрашивать зависимости от внешних источников.
</div>
</details>

<details>
<summary>Что такое Singleton Service и с какой целью его используют в Angular?</summary>
<div>
<br>

Это сервисы, объявленные в приложении и имеющие один экземпляр на все приложение.
Его можно объявить двумя способами:

  <li>Объявить его @Injectable(root)</li>
  <li>Включить его в AppModule в providers, либо в единственный модуль импортируемый в AppModule.</li>
</div>
</details>

<details>
<summary>Как можно определить свой обработчик ErrorHandler, Logging, Cache в Angular?</summary>
<div>
 В Angular можно определить собственные обработчики для ошибок, логирования и кеширования, используя механизм внедрения зависимостей и провайдеров.

**1. Пользовательский обработчик ошибок (ErrorHandler):**

```typescript
import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Логика обработки ошибок
    console.error("Пользовательский обработчик ошибок:", error);

    // Можно добавить отправку ошибок в сервис аналитики или на сервер
    // this.analyticsService.logError(error);
  }
}

// Регистрация в app.module.ts
@NgModule({
  providers: [{ provide: ErrorHandler, useClass: CustomErrorHandler }],
})
export class AppModule {}
```

**2. Сервис логирования (Logging):**

```typescript
import { Injectable } from "@angular/core";

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

@Injectable({
  providedIn: "root",
})
export class LoggingService {
  private currentLevel = LogLevel.Info;

  debug(message: string, ...data: any[]): void {
    this.log(LogLevel.Debug, message, data);
  }

  info(message: string, ...data: any[]): void {
    this.log(LogLevel.Info, message, data);
  }

  warn(message: string, ...data: any[]): void {
    this.log(LogLevel.Warning, message, data);
  }

  error(message: string, ...data: any[]): void {
    this.log(LogLevel.Error, message, data);
  }

  private log(level: LogLevel, message: string, data: any[]): void {
    if (level >= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - ${LogLevel[level]}: ${message}`;

      switch (level) {
        case LogLevel.Debug:
          console.debug(logMessage, ...data);
          break;
        case LogLevel.Info:
          console.info(logMessage, ...data);
          break;
        case LogLevel.Warning:
          console.warn(logMessage, ...data);
          break;
        case LogLevel.Error:
          console.error(logMessage, ...data);
          break;
      }

      // Здесь можно добавить отправку логов на сервер
    }
  }
}
```

**3. Сервис кеширования (Cache):**

```typescript
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  private cache = new Map<string, any>();
  private expirations = new Map<string, number>();

  get<T>(key: string): T | null {
    if (this.hasExpired(key)) {
      this.remove(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  set<T>(key: string, value: T, ttl: number = 300000): void {
    this.cache.set(key, value);
    const expirationTime = Date.now() + ttl;
    this.expirations.set(key, expirationTime);
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.hasExpired(key);
  }

  remove(key: string): void {
    this.cache.delete(key);
    this.expirations.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.expirations.clear();
  }

  private hasExpired(key: string): boolean {
    const expiration = this.expirations.get(key);
    return expiration ? expiration < Date.now() : true;
  }

  // Утилита для кеширования HTTP запросов
  cacheRequest<T>(
    key: string,
    request: Observable<T>,
    ttl?: number
  ): Observable<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return of(cached);
    }

    return request.pipe(tap((response) => this.set(key, response, ttl)));
  }
}
```

Использование этих сервисов обеспечивает централизованный подход к обработке ошибок, логированию и кешированию в Angular-приложении, что улучшает поддерживаемость и расширяемость кода.

</div>
</details>

<details>
<summary>Что такое управление состоянием приложения?</summary>
<div>
Управление состоянием приложения (State Management) — это подход к организации и контролю данных приложения, который определяет, как хранится информация, как она обновляется и как компоненты получают доступ к ней.

**Основные аспекты управления состоянием:**

1. **Хранение данных** — централизованное или распределенное хранение данных, которые используются в разных частях приложения.

2. **Обновление данных** — контролируемые механизмы изменения данных, предотвращающие непредсказуемые мутации.

3. **Доступ к данным** — механизмы получения доступа к данным из различных компонентов приложения.

4. **Синхронизация** — обеспечение актуальности отображаемых данных во всех частях интерфейса.

**Проблемы, которые решает управление состоянием:**

- **Сложность** — по мере роста приложения становится сложнее отслеживать, где и как изменяются данные.
- **Предсказуемость** — неконтролируемые изменения данных могут приводить к непредсказуемому поведению приложения.
- **Отладка** — без четкой структуры состояния сложно находить и исправлять ошибки.
- **Производительность** — неоптимальное обновление UI при изменении данных может приводить к проблемам с производительностью.

**Подходы к управлению состоянием в Angular:**

1. **Стандартные механизмы Angular:**

   - Передача данных через `@Input()` и события `@Output()`
   - Использование сервисов с внедрением зависимостей
   - Использование RxJS для работы с потоками данных

2. **Библиотеки управления состоянием:**

   - **NgRx** — реализация архитектуры Redux для Angular
   - **NGXS** — библиотека, упрощающая работу с состоянием на основе классов и декораторов
   - **Akita** — библиотека для управления состоянием, вдохновленная Redux, но с меньшим количеством шаблонного кода

3. **Современные подходы в Angular:**
   - **Signals** — новая система реактивности в Angular, упрощающая управление состоянием

**Пример простого управления состоянием через сервис:**

```typescript
@Injectable({
  providedIn: "root",
})
export class UserStateService {
  private userSubject = new BehaviorSubject<User | null>(null);

  // Observable для подписки компонентов
  user$ = this.userSubject.asObservable();

  // Геттер для текущего значения
  get currentUser(): User | null {
    return this.userSubject.getValue();
  }

  updateUser(user: User): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }
}
```

Эффективное управление состоянием является ключевым для создания масштабируемых и поддерживаемых приложений.

</div>
</details>

<details>
<summary>В чем отличие между NGRX, NGXS, Akita и какую проблему они решают?</summary>
<div>
Библиотеки NgRx, NGXS и Akita решают общую проблему управления состоянием в Angular-приложениях, но имеют разные подходы и особенности.

**Общие проблемы, которые решают эти библиотеки:**

- Централизованное хранение состояния приложения
- Предсказуемые изменения состояния
- Улучшенная отладка и инструментирование
- Упрощение обмена данными между компонентами
- Кеширование и синхронизация данных

**NgRx:**

NgRx реализует архитектуру Redux в Angular с использованием RxJS.

Особенности:

- Строгая реализация шаблона Redux (actions, reducers, selectors, effects)
- Иммутабельное состояние
- Сильная экосистема дополнительных библиотек (Entity, Router Store, DevTools)
- Имеет наиболее строгий и формализованный подход
- Высокая наглядность потока данных

Пример кода:

```typescript
// Action
export const addTodo = createAction(
  "[Todo] Add Todo",
  props<{ text: string }>()
);

// Reducer
export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { text }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), text, completed: false }],
  }))
);

// Effect
@Injectable()
export class TodoEffects {
  addTodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTodo),
        tap(({ text }) => console.log(`Added todo: ${text}`))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```

**NGXS:**

NGXS упрощает шаблон Redux, используя классы и декораторы.

Особенности:

- Состояние определяется через классы с декораторами
- Меньше шаблонного кода, чем в NgRx
- Интегрированная поддержка для хранения состояния в LocalStorage
- Поддержка снапшотов состояния

Пример кода:

```typescript
// State
@State<TodoStateModel>({
  name: "todos",
  defaults: {
    todos: [],
  },
})
@Injectable()
export class TodoState {
  @Action(AddTodo)
  addTodo(ctx: StateContext<TodoStateModel>, action: AddTodo) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      todos: [
        ...state.todos,
        { id: Date.now(), text: action.text, completed: false },
      ],
    });
  }
}

// Action
export class AddTodo {
  static readonly type = "[Todo] Add Todo";
  constructor(public text: string) {}
}
```

**Akita:**

Akita предоставляет упрощенный подход к управлению состоянием, вдохновленный Redux и норманской моделью баз данных.

Особенности:

- Меньше шаблонного кода по сравнению с NgRx
- Встроенная поддержка нормализации данных
- Встроенные утилиты для работы с entities
- Более гибкий подход к мутациям (можно использовать как иммутабельные, так и мутабельные обновления)

Пример кода:

```typescript
// Store
@StoreConfig({ name: "todos" })
export class TodosStore extends EntityStore<TodosState> {
  constructor() {
    super();
  }
}

// Query
export class TodosQuery extends QueryEntity<TodosState> {
  constructor(protected store: TodosStore) {
    super(store);
  }
}

// Service
@Injectable({ providedIn: "root" })
export class TodosService {
  constructor(private todosStore: TodosStore) {}

  addTodo(text: string) {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    this.todosStore.add(todo);
  }
}
```

**Сравнение:**

| Особенность                | NgRx     | NGXS    | Akita     |
| -------------------------- | -------- | ------- | --------- |
| Сложность входа            | Высокая  | Средняя | Низкая    |
| Количество шаблонного кода | Высокое  | Среднее | Низкое    |
| Строгость архитектуры      | Высокая  | Средняя | Низкая    |
| Гибкость                   | Низкая   | Средняя | Высокая   |
| Инструменты разработчика   | Отличные | Хорошие | Хорошие   |
| Сообщество и поддержка     | Большое  | Среднее | Небольшое |

**Выбор библиотеки** зависит от размера и сложности проекта, предпочтений команды разработчиков и требований к архитектуре.

</div>
</details>

##### Angular with Backend integrations

<details>
<summary>Какими способами можно взаимодействовать с API бэкенда, что требуется для проксирования запросов?</summary>
<div>
  <br>
  <b>Взаимодействие с API</b>

В экосистеме ангуляр существует пакет для общения с сервером
(@angular/common/http), которого достаточно для повседневной разработки. Его интерфейс основан на rxjs потоках, поэтому его легко использовать для работы с потоками данных в приложении.
<br>

Кроме этого, как и в ванильной версии javascript, можно использовать XMLHttpRequest, fetch API, axios(или многие другие библиотеки), но их использование вместо встроенного клиента, считается неоправданным и всячески возбраняется.

Существуют и другие способы взаимодействия с сервером(см. Веб-сокеты), но для них не существует каноничных встроенных библиотек, поэтому используются сторонние библиотеки или собственные реалиации. Хорошей практикой здесь будет привести интерфейс построенный на промисах и обратных вызовах(callback) к интерфейсу основанному на rxjs потоках, для естественного использования в экосистеме Angular.

  <br>
  <b>Proxy</b>

Чтобы тестировать взаимодействие приложения с сервером, который должен находиться на том же домене, используется <a href="https://angular.io/guide/build#proxying-to-a-backend-server"> функциональность в Angular CLI</a> для этого нужно создать файл с конфигурацией прокси, где будут указаны:

  <ul>
    <li>Контекст для проксирования</li>
    <li>Ссылка на работающий экземпляр API</li>
    <li>secure: false для работы в тестовой среде без сертификатов</li>
  </ul>

Также большинство серверов не настроены для работы с разными доменами(<a href="https://developer.mozilla.org/ru/docs/Web/HTTP/CORS">CORS</a>), поэтому для корректной работы на API сервере, необходимо явно указать с какого домена(ов) можно принимать запросы.

</div>
</details>

<details>
<summary>Что такое HTTP Interceptors?</summary>
<br>
<br>
Interceptor (перехватчик) - просто причудливое слово для функции, которая получает запросы / ответы до того, как они будут обработаны / отправлены на сервер. Нужно использовать перехватчики, если имеет смысл предварительно обрабатывать многие типы запросов одним способом. Например нужно для всех запросов устанавливать хедер авторизации `Bearer`:

token.interceptor.ts

```ts
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token") as string;

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}
```

И регистрируем перехватчик как синглтон в провайдерах модуля:

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { TokenInterceptor } from "./token.interceptor";

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true, // <--- может быть зарегистрирован массив перехватчиков
    },
  ],
})
export class AppModule {}
```

<br>

</details>

<details>
<summary>Как использовать Json Web Tokens для аутентификации при разработке на Angular?</summary>
<div>
JSON Web Tokens (JWT) — это стандартный способ безопасной передачи информации между клиентом и сервером в виде JSON-объекта. В Angular JWT часто используются для аутентификации и авторизации пользователей.

**Основной процесс работы с JWT в Angular:**

1. **Аутентификация пользователя** — клиент отправляет учетные данные на сервер
2. **Получение токена** — сервер проверяет учетные данные и возвращает JWT
3. **Хранение токена** — клиент сохраняет токен (обычно в localStorage или sessionStorage)
4. **Отправка токена с запросами** — клиент добавляет токен в заголовок Authorization при запросах к защищенным ресурсам
5. **Обновление токена** — реализация обновления токена после истечения срока действия

**Практическая реализация в Angular:**

**1. Создание сервиса аутентификации:**

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private readonly REFRESH_TOKEN = "REFRESH_TOKEN";
  private currentUserSubject = new BehaviorSubject<any>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>("/api/auth/login", user).pipe(
      tap((tokens) => {
        this.storeTokens(tokens);
        this.setCurrentUser();
      })
    );
  }

  logout() {
    // Опционально: отправить запрос на сервер для инвалидации токенов
    this.http
      .post("/api/auth/logout", {
        refreshToken: this.getRefreshToken(),
      })
      .subscribe();

    this.removeTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http
      .post<any>("/api/auth/refresh", {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        })
      );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private checkToken() {
    const token = this.getJwtToken();
    if (token) {
      this.setCurrentUser();
    }
  }

  private setCurrentUser() {
    // Декодирование JWT для получения информации о пользователе
    const token = this.getJwtToken();
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const user = JSON.parse(jsonPayload);
      this.currentUserSubject.next(user);
    }
  }
}
```

**2. Создание HTTP интерцептора для автоматического добавления токена в запросы:**

```typescript
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(public authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Не добавляем токен для запросов аутентификации
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    // Добавляем токен, если он есть
    const token = this.authService.getJwtToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private isAuthRequest(request: HttpRequest<any>): boolean {
    return (
      request.url.includes("/api/auth/login") ||
      request.url.includes("/api/auth/refresh")
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
```

**3. Настройка HTTP интерцептора в модуле приложения:**

```typescript
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./jwt.interceptor";

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class AppModule {}
```

**4. Создание AuthGuard для защиты маршрутов:**

```typescript
import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(["/login"]);
    return false;
  }
}
```

**5. Использование AuthGuard в настройках маршрутизации:**

```typescript
const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "" },
];
```

**Преимущества использования JWT для аутентификации:**

1. **Без состояния (Stateless)** — сервер не хранит информацию о сессии, что делает систему масштабируемой
2. **Уменьшение нагрузки на сервер** — нет необходимости проверять сессию в базе данных при каждом запросе
3. **Безопасность** — токены могут быть подписаны и зашифрованы
4. **Универсальность** — JWT могут использоваться на разных доменах и платформах

**Потенциальные проблемы и решения:**

- **Безопасность хранения токенов** — использование HttpOnly cookies вместо localStorage для защиты от XSS
- **Обработка истечения срока действия токена** — реализация механизма обновления токена
- **Revocation (отзыв) токенов** — сервер может вести "чёрный список" невалидных токенов или использовать токены с коротким сроком жизни

При правильной реализации JWT обеспечивает надежную и эффективную систему аутентификации для Angular-приложений.

</div>
</details>

<details>
<summary>Как обрабатываются атаки XSS и CSRF в Angular?</summary>
<div>
Angular имеет встроенные механизмы защиты от распространенных веб-уязвимостей, таких как XSS (Cross-Site Scripting) и CSRF (Cross-Site Request Forgery).

**Защита от XSS в Angular:**

XSS-атаки позволяют злоумышленникам внедрять вредоносный код в веб-приложения, который затем выполняется в браузерах пользователей. Angular предоставляет несколько уровней защиты:

1. **Автоматическая Санитизация**:

   - Angular автоматически экранирует значения, используемые в шаблонах, предотвращая выполнение вредоносного кода
   - В шаблонах Angular определяет все значения как непроверенные по умолчанию, и автоматически санитизирует их в зависимости от контекста (HTML, URL, стили, ресурсы)

2. **Контекстно-зависимая санитизация**:

   ```typescript
   // Безопасно: автоматическая санитизация в HTML-контексте
   <div>{{ userInput }}</div>

   // Angular предотвращает привязки к небезопасным URL-адресам
   <a [href]="userProvidedUrl">Ссылка</a>
   ```

3. **Защита от innerHTML-уязвимостей**:

   - Когда вы используете `[innerHTML]="data"`, Angular автоматически санитизирует значение
   - Скрипты, onEvent обработчики и вредоносный CSS удаляются

4. **DomSanitizer** для случаев, когда требуется обойти санитизацию:

   ```typescript
   import { DomSanitizer } from '@angular/platform-browser';

   @Component({...})
   export class AppComponent {
     constructor(private sanitizer: DomSanitizer) {
       // Используйте только когда вы уверены в безопасности контента
       this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
       this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
       this.trustedResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
       this.trustedScript = this.sanitizer.bypassSecurityTrustScript(script);
       this.trustedStyle = this.sanitizer.bypassSecurityTrustStyle(style);
     }
   }
   ```

**Защита от CSRF в Angular:**

CSRF-атаки заставляют аутентифицированного пользователя неосознанно выполнять действия на веб-сайте. Angular предоставляет защиту через:

1. **HttpClientXsrfModule** - встроенный механизм для отправки XSRF-TOKEN с каждым HTTP-запросом:

   ```typescript
   import { HttpClientXsrfModule } from "@angular/common/http";

   @NgModule({
     imports: [
       HttpClientXsrfModule.withOptions({
         cookieName: "XSRF-TOKEN", // имя cookie по умолчанию
         headerName: "X-XSRF-TOKEN", // имя заголовка по умолчанию
       }),
     ],
   })
   export class AppModule {}
   ```

2. **Принцип работы CSRF-защиты**:

   - Сервер устанавливает cookie с XSRF-токеном
   - Angular автоматически читает это cookie и добавляет токен в HTTP-заголовок для небезопасных методов (POST, PUT, DELETE и т.д.)
   - Сервер проверяет соответствие токена в cookie и заголовке

3. **SameSite Cookies** - современный подход, который можно использовать вместе с CSRF-токенами:
   ```
   Set-Cookie: Session=123; SameSite=Strict
   ```

**Дополнительные рекомендации по безопасности:**

1. **Избегайте прямых манипуляций с DOM**:

   - Используйте абстракции Angular для работы с DOM
   - Не используйте `document`, `window` и нативные API напрямую, когда это возможно

2. **Content Security Policy (CSP)**:

   ```html
   <meta
     http-equiv="Content-Security-Policy"
     content="default-src 'self'; script-src 'self'; style-src 'self';"
   />
   ```

3. **Angular Security Best Practices**:

   - Регулярное обновление фреймворка и зависимостей
   - Использование официальных библиотек
   - Проверка пользовательского ввода на стороне сервера
   - Использование HTTPS для всех соединений

4. **Предостережения**:
   - Не обходите встроенные механизмы безопасности Angular без необходимости
   - Будьте осторожны при использовании `bypassSecurityTrust*` методов - они должны применяться только когда вы уверены в безопасности данных

Встроенные механизмы безопасности Angular делают защиту от XSS и CSRF относительно простой, но для полной защиты необходим комплексный подход, включающий как клиентские, так и серверные меры.

</div>
</details>

##### Angular routing

<details>
<summary>Что такое роутинг и как его создать в Angular?</summary>
<div>
  <br>
  Роутинг позволяет реализовать навигацию от одного view приложения к другому при работе пользователя с приложением.
  <br>Это реализовано через взаимодействие с адресной строкой, Angular Router интерпретирует ее как инструкцию по переходу между view. Возможна передача параметров вспомогательному компоненту для конкретизирования предоставляемого контента. Навигация может осуществлять по ссылкам на странице, кнопкам или другим элементам, как кнопки "вперед-назад" в браузере.
  <br>Для создания роутинга первым делом необходимо импортировать "RouterModule" и "Routes" в AppModule.
  <br>Затем необходимо реализовать конфигурацию по приложению, определить path и относящие к ним компоненты, и в метод RouterModule.forRoot() передать конфигурацию.
  <br>Наконец необходимо добавить routerLink в шаблон.
</div>
</details>

<details>
<summary>Каков жизненный цикл у Angular Router?</summary>
<div>
  <br>
  <p>
    <img src='https://susdev.ru/wp-content/uploads/2019/02/router-navigation-lifecycle.png'  alt=""/>
    <a href='https://susdev.ru/angular-router-series-router-navigation-cycle/'>Источник информации</a>
  </p>
  <p>
    <ol>
      <li><b>NavigationStart</b> - начало навигации. Возникает во время нажатия на директиву <b>router link</b>, вызове функций <b>navigate</b> и <b>navigateByUrl</b></li>
      <li><b>RoutesRecognized</b> - cопоставление URL-адресов и редиректы. Роутер сопоставляет URL-адрес навигации из первого события с одним из свойств path в конфигурации, применяя любые редиректы по-пути.</li>
      <li><b>GuardsCheckStart, GuardsCheckEnd</b> - функции, которые использует роутер для определения может ли он выполнить навигацию. Пример:

```ts
// router configuration
const config = {
  path: "users",
  /* ... */
  canActivate: [CanActivateGuard],
};

class Guard {
  // router guard implementation
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.auth.isAuthorized(route.queryParams.login);
  }
}
```

  <br />

Если вызов `isAuthorized(route.queryParams.login)` возвращает true, guard завершится успехом. В противном случае guard упадет, роутер сгенерирует событие `NavigationCancel` и отменит всю дальнейшую навигацию.
<br />

Другие guard включают `canLoad` (должен ли модуль быть лениво загружен или нет). `canActivateChild` и `canDeactivate` (которые полезны для предотвращения ухода пользователя со страницы, например, при заполнении формы).

  </li>
  <li><b>ResolveStart, ResolveEnd</b> - функции, которые мы можем использовать для подгрузки данных во время навигации. Например:

```ts
// router configuration
const config = {
  path: "users",
  /* ... */
  resolve: { users: UserResolver },
};

// router resolver implementation
export class UserResolver implements Resolve<Observable<any>> {
  constructor(private userService: MockUserDataService) {}
  resolve(): Observable<any> {
    return this.userService.getUsers();
  }
}
```

<br/>

Результат, то есть данные, будет положен в `data` объект сервиса `ActivatedRoute` с ключом `users`. Данная информация может быть прочитаны с помощью подписки на `data` `observable`.

```ts
export class UsersComponent implements OnInit {
  public users = [];
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.data
      .pipe(first())
      .subscribe((data) => (this.users = data.users));
  }
}
```

  </li>
  <li><b>ActivationStart, ActivationEnd, ChildActivationStart, ChildActivationEnd</b> - события, во время которых активируются компоненты и отображаются их с помощью <router-outlet>.Роутер может извлечь необходимую информацию о компоненте из дерева ActivatedRouteSnapshots. Он был построен в предыдущие шаги навигационного цикла.</li>
  <li><b>Updating the URL</b> - последний шаг в навигационном цикле — это обновление URL-адреса в address bar</li>
  </ol>

</div>
</details>

<details>
<summary>Что такое ленивая загрузка (Lazy-loading) и для чего она используется?</summary>
<div>
Ленивая загрузка (Lazy-loading) в Angular — это техника, которая позволяет загружать части приложения (модули) только когда они необходимы, вместо загрузки всего приложения при первоначальном запуске.

**Принцип работы ленивой загрузки:**

1. При начальной загрузке приложения загружаются только основные модули, необходимые для отображения главной страницы
2. Остальные модули загружаются асинхронно, по мере необходимости (обычно при навигации к определенным маршрутам)
3. Это достигается с помощью динамических импортов и маршрутизации Angular

**Преимущества ленивой загрузки:**

1. **Улучшение начальной производительности:**

   - Уменьшение размера начального бандла
   - Сокращение времени загрузки при первом посещении
   - Ускорение времени до интерактивности (TTI)

2. **Оптимизация использования ресурсов:**

   - Загрузка только необходимого кода
   - Экономия трафика, особенно важно для мобильных устройств
   - Снижение нагрузки на память браузера

3. **Улучшение пользовательского опыта:**
   - Более быстрый запуск приложения
   - Постепенная загрузка функциональности по мере необходимости

**Реализация ленивой загрузки в Angular:**

1. **На уровне маршрутизации:**

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.module").then((m) => m.ProductsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

2. **Структура модуля с ленивой загрузкой:**

```typescript
// products/products.module.ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ProductListComponent } from "./product-list.component";
import { ProductDetailComponent } from "./product-detail.component";

const routes: Routes = [
  {
    path: "", // Обратите внимание: путь уже относительный
    component: ProductListComponent,
  },
  {
    path: ":id",
    component: ProductDetailComponent,
  },
];

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Используем forChild для дочерних маршрутов
  ],
})
export class ProductsModule {}
```

3. **Предварительная загрузка (Preloading):**

Angular также поддерживает стратегии предварительной загрузки, которые позволяют загружать модули в фоне после загрузки основного приложения:

```typescript
import { PreloadAllModules } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
})
export class AppRoutingModule {}
```

4. **Кастомная стратегия предварительной загрузки:**

```typescript
import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}

// Использование в маршрутах
const routes: Routes = [
  {
    path: "customers",
    loadChildren: () =>
      import("./customers/customers.module").then((m) => m.CustomersModule),
    data: { preload: true },
  },
];
```

5. **Standalone components с ленивой загрузкой:**

С новыми функциями Angular можно использовать ленивую загрузку и с отдельными компонентами:

```typescript
const routes: Routes = [
  {
    path: "profile",
    loadComponent: () =>
      import("./profile/profile.component").then((m) => m.ProfileComponent),
  },
];
```

**Лучшие практики ленивой загрузки:**

1. **Правильное разделение модулей:**

   - Организуйте код по функциональности или бизнес-доменам
   - Сгруппируйте связанные компоненты, директивы и сервисы в функциональные модули

2. **Оптимизация размера модулей:**

   - Избегайте слишком крупных и слишком мелких модулей
   - Находите баланс между количеством запросов и размером каждого бандла

3. **Использование предварительной загрузки:**

   - Реализуйте кастомные стратегии предварительной загрузки в зависимости от ожидаемого поведения пользователей

4. **Анализ производительности:**
   - Используйте инструменты для анализа бандлов (webpack-bundle-analyzer)
   - Измеряйте влияние ленивой загрузки на ключевые метрики производительности

Ленивая загрузка — это эффективная стратегия для оптимизации современных Angular-приложений, особенно для крупных проектов с множеством маршрутов и функциональных возможностей.

</div>
</details>

<details>
<summary>В чем разница между Routing и Navigation?</summary>
<div>
В Angular термины "Routing" (маршрутизация) и "Navigation" (навигация) связаны с перемещением между различными частями приложения, но представляют разные аспекты этого процесса.

**Routing (Маршрутизация):**

Routing в Angular — это механизм, определяющий, какие компоненты должны отображаться на основе текущего URL в браузере. Это декларативная система, описывающая структуру приложения.

**Ключевые аспекты маршрутизации:**

1. **Определение маршрутов:**
   - Конфигурация, связывающая URL-пути с компонентами
   - Настройка параметров, дочерних маршрутов, редиректов и guards

```typescript
const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "products", component: ProductListComponent },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];
```

2. **Компоненты маршрутизации:**

   - `<router-outlet>` — определяет, где будут отображаться компоненты маршрутов
   - `RouterModule` — модуль, предоставляющий функциональность маршрутизации

3. **Guard-службы:**
   - `CanActivate` — контролирует доступ к маршруту
   - `CanDeactivate` — проверяет, можно ли покинуть маршрут
   - `Resolve` — предварительно загружает данные перед активацией маршрута
   - `CanLoad` — определяет, можно ли загружать модуль с ленивой загрузкой

**Navigation (Навигация):**

Navigation — это процесс фактического перемещения между различными состояниями/маршрутами приложения. Это императивная или декларативная часть, запускающая изменение маршрута.

**Способы навигации в Angular:**

1. **Декларативная навигация (в шаблонах):**
   - Использование директивы `routerLink` для создания ссылок

```html
<a routerLink="/products">Все продукты</a>
<a [routerLink]="['/products', product.id]">{{ product.name }}</a>
<a routerLink="../" routerLinkActive="active-link">Назад</a>
```

2. **Императивная навигация (в коде компонентов):**
   - Использование сервиса `Router` для программной навигации

```typescript
import { Router } from '@angular/router';

@Component({...})
export class ProductComponent {
  constructor(private router: Router) {}

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }
}
```

3. **Передача параметров:**
   - Через путь (path parameters): `/products/42`
   - Через строку запроса (query parameters): `/products?category=electronics`
   - Фрагменты (fragments): `/products#top`

```typescript
// Передача query параметров и фрагмента
this.router.navigate(["/products"], {
  queryParams: { category: "electronics", sort: "price" },
  fragment: "top",
});
```

**Ключевые различия между Routing и Navigation:**

| Характеристика | Routing (Маршрутизация)        | Navigation (Навигация)        |
| -------------- | ------------------------------ | ----------------------------- |
| Тип            | Декларативная система          | Процесс действия              |
| Функция        | Определяет структуру и правила | Выполняет перемещение         |
| Компоненты     | RouteModule, Routes, Guards    | routerLink, Router.navigate() |
| Время работы   | Конфигурация приложения        | Взаимодействие пользователя   |
| Фокус          | "Что" отображать по URL        | "Как" перейти на другой URL   |

**События жизненного цикла навигации:**

Angular предоставляет события, которые позволяют отслеживать и реагировать на различные этапы навигации:

```typescript
this.router.events.subscribe((event) => {
  if (event instanceof NavigationStart) {
    // Началась навигация
  }
  if (event instanceof NavigationEnd) {
    // Навигация успешно завершена
  }
  if (event instanceof NavigationCancel) {
    // Навигация была отменена
  }
  if (event instanceof NavigationError) {
    // Произошла ошибка навигации
  }
});
```

**Практическое применение:**

1. **Routing используется для:**

   - Определения общей структуры приложения
   - Настройки защиты маршрутов через guards
   - Организации ленивой загрузки модулей
   - Определения стратегии маршрутизации (хэш или путь)

2. **Navigation используется для:**
   - Создания пользовательского интерфейса навигации
   - Программного перехода между страницами
   - Передачи данных между маршрутами
   - Обработки пользовательских действий

Понимание разницы между маршрутизацией и навигацией помогает более эффективно структурировать и организовывать перемещение пользователей в Angular-приложениях, создавая интуитивно понятный и отзывчивый пользовательский опыт.

</div>
</details>

<details>
<summary>Как загрузить данные до того как активируется роут?</summary>
<div>
Загрузка данных перед активацией маршрута в Angular позволяет предотвратить отображение компонента до получения необходимых данных, что улучшает пользовательский опыт. Существует несколько способов реализации этого подхода.

## 1. Использование Resolve Guard

Resolve Guard — это наиболее структурированный способ предзагрузки данных перед активацией маршрута.

**Преимущества:**

- Данные загружаются до активации маршрута
- Маршрут активируется только после успешной загрузки данных
- Четкое разделение ответственности

**Реализация:**

1. **Создание Resolver сервиса:**

```typescript
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ProductService } from "./product.service";
import { Product } from "./product.model";

@Injectable({
  providedIn: "root",
})
export class ProductResolver implements Resolve<Product> {
  constructor(private productService: ProductService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const productId = route.paramMap.get("id");

    return this.productService.getProduct(productId).pipe(
      catchError((error) => {
        console.error("Ошибка при загрузке продукта", error);
        // Возвращаем пустой продукт или перенаправляем на страницу ошибки
        return of({ id: "", name: "Не найдено", price: 0 });
      })
    );
  }
}
```

2. **Настройка маршрута с resolver:**

```typescript
const routes: Routes = [
  {
    path: "products/:id",
    component: ProductDetailComponent,
    resolve: {
      product: ProductResolver,
    },
  },
];
```

3. **Доступ к предзагруженным данным в компоненте:**

```typescript
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "./product.model";

@Component({
  selector: "app-product-detail",
  template: `
    <div *ngIf="product">
      <h2>{{ product.name }}</h2>
      <p>Цена: {{ product.price | currency }}</p>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product: Product;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Данные уже доступны из resolver
    this.product = this.route.snapshot.data.product;

    // Или с использованием Observable для реагирования на изменения
    this.route.data.subscribe((data) => {
      this.product = data.product;
    });
  }
}
```

## 2. Использование Route Guards (CanActivate)

Еще один подход — использование CanActivate guard для условной активации маршрута после загрузки данных.

```typescript
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: "root",
})
export class ProductDataGuard implements CanActivate {
  constructor(private productService: ProductService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const productId = route.paramMap.get("id");

    return this.productService.getProduct(productId).pipe(
      tap((product) => {
        // Сохраняем данные в сервисе, откуда компонент может их получить
        this.productService.setCurrentProduct(product);
      }),
      map((product) => !!product), // Преобразуем в boolean
      catchError(() => {
        this.router.navigate(["/not-found"]);
        return of(false);
      })
    );
  }
}
```

## 3. Использование Route Data и APP_INITIALIZER

Для глобальных данных, необходимых при запуске приложения, можно использовать APP_INITIALIZER.

```typescript
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ConfigService } from "./config.service";

// Функция для предзагрузки конфигурации
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
})
export class AppModule {}
```

## 4. Использование defer с новыми версиями Angular

В новых версиях Angular можно использовать блоки `@defer` в шаблонах для асинхронной загрузки компонентов и контента:

```html
@defer (when data.loaded) {
<app-product-details [product]="data.product"></app-product-details>
} @loading {
<app-loading-spinner></app-loading-spinner>
} @error {
<app-error-message></app-error-message>
}
```

## 5. Новые функции Angular Signals

С представлением Angular Signals появился еще один подход к управлению загрузкой данных:

```typescript
import { Component, signal, computed } from "@angular/core";
import { ProductService } from "./product.service";

@Component({
  selector: "app-product",
  template: `
    @if (isLoading()) {
    <app-loading-spinner />
    } @else if (product()) {
    <h2>{{ product().name }}</h2>
    } @else {
    <p>Продукт не найден</p>
    }
  `,
})
export class ProductComponent {
  product = signal(null);
  isLoading = signal(true);

  constructor(productService: ProductService, route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get("id");
    productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
```

## Лучшие практики предварительной загрузки данных:

1. **Выбор подходящего метода:**

   - Используйте Resolve для данных, критических для маршрута
   - Используйте APP_INITIALIZER для глобальных настроек
   - Используйте ленивую загрузку данных для некритичной информации

2. **Обработка ошибок:**

   - Всегда предусматривайте обработку ошибок при загрузке данных
   - Решите, перенаправлять пользователя или показывать сообщение об ошибке

3. **Индикация загрузки:**

   - Показывайте индикатор загрузки во время получения данных
   - Реализуйте таймауты для длительных операций

4. **Кеширование:**

   - Кешируйте данные, которые редко меняются
   - Используйте стратегии инвалидации кеша при необходимости

5. **Оптимизация производительности:**
   - Загружайте только необходимые данные
   - Используйте пагинацию или виртуальный скроллинг для больших наборов данных

Правильная стратегия предварительной загрузки данных значительно улучшает пользовательский опыт, предотвращая отображение пустых или частично заполненных экранов и снижая воспринимаемое время загрузки приложения.

</div>
</details>

##### Angular Forms (also big ui enterprise)

<details>
<summary>Что такое FormGroup и FormControl и для чего они используются?</summary>
<div>
  <br>
  <li>FormControl - отслеживает значение и статус валидации отдельного элемента формы.</li>
  <li>FormGroup - отслеживает состояние и статус валидации группы FormControl </li>
  <br>Они используются для создания и работы с формами.
</div>
</details>

<details>
<summary>Что такое реактивные формы в Angular?</summary>
<div>
  Реактивные формы обеспечивают управляемый моделями подход к обработке входных данных форм, значения которых могут меняться со временем. Они строятся вокруг наблюдаемых потоков, где входные данные и значения форм предоставляются в виде потоков входных значений, к которым можно получить синхронный доступ. 
</div>
</details>

<details>
<summary>Как применять валидацию для простых и сложных форм?</summary>
<div>
  В реактивных формах валидация реализуется в компоненте. Есть два типа валидаторов: синхронные и асинхронные.
  <br>Можно использовать встроенные валидаторы, либо создать свои. Валидаторы добавляются 
</div>
</details>

##### Build environments

<details>
<summary>В чем разница между Angular CLI и Webpack Development Environment?</summary>
<div>
Angular CLI и Webpack Development Environment представляют собой инструменты для разработки приложений, но имеют разные уровни абстракции, возможности и подходы к организации процесса разработки.

## Angular CLI

Angular CLI (Command Line Interface) — это официальный инструмент командной строки для Angular, который абстрагирует и упрощает множество задач разработки.

**Основные возможности Angular CLI:**

1. **Создание проекта и компонентов:**

   ```bash
   ng new my-app
   ng generate component my-component
   ng generate service my-service
   ```

2. **Автоматическая конфигурация:**

   - Предустановленные настройки для TypeScript, тестирования, линтинга
   - Автоматическая настройка путей и импортов
   - Управление зависимостями

3. **Встроенный девелоперский сервер:**

   ```bash
   ng serve --open
   ```

4. **Сборка для производства:**

   ```bash
   ng build --configuration production
   ```

5. **Тестирование:**

   ```bash
   ng test
   ng e2e
   ```

6. **Обновление Angular:**

   ```bash
   ng update @angular/core @angular/cli
   ```

7. **Расширяемость:**
   - Schematics для расширения функциональности
   - Возможность добавления пользовательских команд

**Внутренняя архитектура Angular CLI:**

Под капотом Angular CLI использует Webpack для сборки, но скрывает сложность его настройки. С версии Angular 8+ используется Builders API, что позволяет заменять стандартный процесс сборки.

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // Конфигурация сборки
          }
        }
      }
    }
  }
}
```

## Webpack Development Environment

Webpack — это мощный инструмент сборки (bundler), который анализирует модули приложения и их зависимости, объединяя их в оптимизированные статические файлы.

**Ключевые возможности Webpack:**

1. **Полный контроль над процессом сборки:**

   ```javascript
   // webpack.config.js
   module.exports = {
     entry: "./src/main.ts",
     output: {
       path: path.resolve(__dirname, "dist"),
       filename: "bundle.js",
     },
     module: {
       rules: [
         {
           test: /\.ts$/,
           use: "ts-loader",
           exclude: /node_modules/,
         },
       ],
     },
   };
   ```

2. **Гибкость конфигурации:**

   - Пользовательские загрузчики (loaders)
   - Плагины для оптимизации
   - Множество параметров настройки

3. **Расширенные возможности:**

   - Разделение кода (code splitting)
   - Ленивая загрузка (lazy loading)
   - Оптимизация бандлов

4. **Экосистема плагинов:**
   - HtmlWebpackPlugin
   - MiniCssExtractPlugin
   - TerserPlugin
   - И множество других

## Основные различия между Angular CLI и Webpack

| Характеристика           | Angular CLI                             | Webpack Development Environment       |
| ------------------------ | --------------------------------------- | ------------------------------------- |
| **Уровень абстракции**   | Высокий (скрывает сложности)            | Низкий (требует ручной настройки)     |
| **Кривая обучения**      | Пологая (быстрый старт)                 | Крутая (требует углубленных знаний)   |
| **Настраиваемость**      | Ограниченная (без eject)                | Полная, с доступом ко всем параметрам |
| **Фокус**                | Разработка Angular-приложений           | Универсальная сборка веб-приложений   |
| **Интеграция с Angular** | Полная, "из коробки"                    | Требует ручной настройки              |
| **Экосистема**           | Часть экосистемы Angular                | Независимый инструмент                |
| **Обновления**           | Автоматическое обновление с фреймворком | Ручное управление версиями            |
| **Инструменты**          | Генераторы, анализаторы, команды        | Только сборка и зависимости           |

## Когда использовать каждый из подходов

**Выбор Angular CLI подходит, когда:**

1. Вы разрабатываете стандартное Angular-приложение
2. Хотите быстро начать разработку без глубокого погружения в конфигурацию
3. Предпочитаете следовать официальным рекомендациям и лучшим практикам Angular
4. Цените автоматизацию и удобство над полным контролем
5. Работаете в команде, где важна стандартизация процесса

**Выбор прямой работы с Webpack предпочтителен, когда:**

1. Требуется нестандартная конфигурация сборки, не поддерживаемая Angular CLI
2. Интегрируете Angular в существующий проект с собственной системой сборки
3. Хотите полного контроля над процессом сборки и оптимизации
4. Имеете специфические требования к разделению кода или управлению ресурсами
5. Разрабатываете гибридное приложение, объединяющее различные фреймворки

## Объединение подходов

С версии Angular 6+ появилась возможность кастомизировать конфигурацию Webpack без отказа от Angular CLI:

1. **Частичная настройка через angular.json:**

   ```json
   "architect": {
     "build": {
       "options": {
         "styles": ["src/styles.css", "src/assets/external.css"],
         "scripts": ["node_modules/jquery/dist/jquery.min.js"],
         "vendorChunk": true,
         "extractLicenses": false,
         "buildOptimizer": false,
         "sourceMap": true,
         "optimization": false,
         "namedChunks": true
       }
     }
   }
   ```

2. **Пользовательские webpack-конфигурации через builders:**

   ```bash
   npm install -D @angular-builders/custom-webpack
   ```

   ```json
   // angular.json
   "architect": {
     "build": {
       "builder": "@angular-builders/custom-webpack:browser",
       "options": {
         "customWebpackConfig": {
           "path": "./extra-webpack.config.js"
         }
       }
     }
   }
   ```

3. **Использование ngx-build-plus для расширенных возможностей:**
   ```bash
   npm install ngx-build-plus --save-dev
   ```

## Заключение

Angular CLI и Webpack — не конкурирующие, а дополняющие друг друга инструменты. Angular CLI использует Webpack под капотом, но предоставляет более высокоуровневый и удобный интерфейс, специально настроенный для разработки Angular-приложений.

Для большинства проектов Angular CLI обеспечивает оптимальный баланс между удобством и возможностями. Когда стандартных возможностей недостаточно, можно расширить конфигурацию, не отказываясь полностью от преимуществ CLI.

В сложных случаях, требующих полного контроля над процессом сборки, прямое использование Webpack может быть оправдано, но следует учитывать дополнительные затраты на настройку и поддержку такого решения.

</div>
</details>

<details>
<summary>Что такое JIT и AOT, в чем их отличия и каковы сферы применения?</summary>
<div>
  <br>
  <p>Angular приложение можно скомпилировать с помощью команд <b>ng serve</b> и <b>ng build</b>. При этом, можно работать с разными видами компиляции:
  <ul>
    <li> <b>JIT</b> - (Just-In-Time compilation) - компиляция "на лету", динамическая компиляция. В Angular используется по умолчанию.</li>
    <li> <b>AOT</b> -  (Ahead-Of-Time compilation) - компиляции перед исполнением.</li>
  </ul>
  <p>Основные различия:</p>
  <table>
    <thead>
      <tr><td>Параметры</td><td>JIT</td><td>AOT</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Когда компилируется</td>
        <td>в момент запуска приложения в браузере</td>
        <td>в момент сборки приложения</td>
      </tr>
      <tr>
        <td>Рекомендуется использовать для</td>
        <td>локальной разработки</td>
        <td>создания продуктовой сборки</td>
      </tr>
      <tr>
        <td>Как включить</td>
        <td>Не нужно выставлять дополнительных флагов</td>
        <td>Нужно добавить флаг --aot или --prod</td>
      </tr>
      <tr>
        <td>Скорость</td>
        <td>Скорость компиляции быстрее, загрузка в браузере дольше</td>
        <td>Скорость компиляции дольше, загрузка в браузере быстрее</td>
      </tr>
      <tr>
        <td>Размер бандла</td>
        <td>Бандл имеет большой размер из-за включенного в бандл компилятора.</td>
        <td>Бандл имеет небольшой размер, тк содержит полностью скомпилированный и оптимизированный код.</td>
      </tr>
      <tr>
        <td>Выявление ошибок</td>
        <td>Ошибки отобразятся во время запуска приложения в браузере</td>
        <td>Выявление ошибок во время компиляции</td>
      </tr>
      <tr>
        <td>Работа с файлами</td>
        <td>Может компилировать только измененные файлы отдельно</td>
        <td>Компилирует сразу все файлы приложения</td>
      </tr>
    </tbody>
  </table>
</div>
</details>

##### Test development

<details>
<summary>Что такое Unit-тестирование, интеграционное, e2e-тестирование (End-to-End) и как оно применяется в Angular?</summary>
<div>
1. **Unit-тестирование** — методика тестирования отдельных изолированных компонентов/функций/модулей приложения. В Angular используется для проверки логики сервисов, компонентов и пайпов в изоляции от других частей приложения. Для этого применяются моки и стабы зависимостей. В Angular осуществляется с помощью TestBed API.

2. **Интеграционное тестирование** — проверяет взаимодействие между несколькими модулями/компонентами приложения. В Angular тестируется взаимодействие компонентов с их дочерними компонентами, сервисами и директивами. TestBed позволяет создавать тестовые модули, включающие необходимые зависимости.

3. **E2E-тестирование** — имитирует взаимодействие пользователя с приложением от начала до конца, проверяя работу всей системы в целом. Для Angular традиционно использовался Protractor, но сейчас рекомендуется использовать Cypress или Playwright.

4. **Применение в Angular**: Unit-тесты используют TestBed для имитации Angular окружения; интеграционные тесты проверяют компоненты с их шаблонами и сервисами; e2e-тесты могут использовать Cypress для проверки пользовательских сценариев.

5. **Структура тестов в Angular**: Файлы тестов обычно имеют расширение `.spec.ts` и располагаются рядом с тестируемыми файлами. Запуск тестов осуществляется командой `ng test` для модульных тестов и `ng e2e` для e2e-тестов.
</div>
</details>

<details>
<summary>Что такое Karma, Jasmine (зачем их используют совместно при разработке на Angular)?</summary>
<div>
 1. **Jasmine** — фреймворк для тестирования JavaScript, предоставляющий функции для написания тестов (describe, it, expect). Он не требует DOM и отличается простым синтаксисом. В контексте Angular используется для определения структуры тестов и написания утверждений.

2. **Karma** — тест-раннер, разработанный командой Angular для запуска JavaScript-тестов в реальных браузерах. Karma запускает спецификации Jasmine в различных браузерах, собирает результаты и выводит отчёты.

3. **Использование совместно**: Jasmine определяет структуру и содержание тестов, а Karma обеспечивает их выполнение в браузере. Такая комбинация позволяет тестировать взаимодействие кода с DOM-API и проверять совместимость с различными браузерами.

4. **Конфигурация в Angular**: При создании проекта через Angular CLI автоматически настраиваются Karma (karma.conf.js) и Jasmine. Это упрощает запуск тестов командой `ng test` без дополнительной настройки.

5. **Преимущества совместного использования**: Jasmine предоставляет понятный человеку синтаксис для описания ожидаемого поведения, а Karma обеспечивает автоматизацию запуска тестов в различных средах, что делает их идеальной комбинацией для разработки на Angular.
</div>
</details>

<details>
<summary>В чем разница между Jest и Karma?</summary>
<div>
 1. **Окружение выполнения**: Karma запускает тесты в реальных браузерах (Chrome, Firefox и т.д.), тогда как Jest запускает тесты в среде Node.js с использованием JSDOM для эмуляции браузерного API. Это делает Jest быстрее, но Karma даёт более точную проверку совместимости с браузерами.

2. **Скорость и параллелизм**: Jest выполняет тесты параллельно и изолированно, что значительно ускоряет процесс тестирования. Karma запускает тесты последовательно, что медленнее, особенно при большом количестве тестов.

3. **Встроенные возможности**: Jest предоставляет всё необходимое "из коробки": средства мокирования, снапшот-тестирование, coverage-отчёты. Karma требует дополнительных плагинов и интеграции с другими инструментами (например, Jasmine или Mocha).

4. **Настройка и конфигурация**: Jest имеет минимальные требования к настройке и хорошо работает с нулевой конфигурацией. Karma требует более сложной настройки с определением браузеров, фреймворков и репортеров.

5. **Совместимость с Angular**: Karma традиционно использовалась в Angular, однако начиная с Angular 12+ стало возможным настроить проект с Jest вместо Karma/Jasmine. Jest становится популярнее благодаря скорости и удобству, хотя требует дополнительной настройки для интеграции с Angular.
</div>
</details>

<details>
<summary>В чем разница между Protractor и Cypress?</summary>
<div>
1. **Архитектура**: Protractor построен на Selenium WebDriver и работает через отдельный процесс, управляющий браузером. Cypress работает непосредственно в браузере, выполняя тесты в том же контексте, что и тестируемое приложение, что обеспечивает более стабильное и быстрое выполнение.

2. **Асинхронность**: Protractor использует WebDriverJS и промисы для асинхронных операций, что усложняет отладку. Cypress автоматически ожидает завершения асинхронных операций и предоставляет более понятную модель для работы с асинхронностью.

3. **Отладка и визуализация**: Cypress предлагает превосходные инструменты отладки: снимки DOM на каждом шаге, запись видео, временная шкала выполнения тестов. Protractor имеет более ограниченные возможности отладки и требует дополнительной настройки для визуализации.

4. **Интеграция с Angular**: Protractor был разработан специально для Angular и имеет встроенную поддержку NgZone и стабилизации приложения. Cypress не имеет специальной интеграции с Angular, но хорошо работает с любыми фреймворками благодаря своему подходу к выполнению команд.

5. **Будущее развитие**: Protractor официально устарел и не рекомендуется для новых проектов на Angular. Команда Angular рекомендует использовать Cypress, Playwright или WebdriverIO вместо Protractor. Cypress активно развивается и имеет большое сообщество.
</div>
</details>

<details>
<summary>Как протестировать входные параметры и всплывающие события компонентов?</summary>
<div>
 1. **Тестирование входных параметров**: Создайте экземпляр компонента через TestBed, используя `componentInstance` для прямой установки входных параметров:

```typescript
const fixture = TestBed.createComponent(MyComponent);
fixture.componentInstance.inputProperty = testValue;
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain("ожидаемый результат");
```

2. **Тестирование всплывающих событий**: Используйте шпионы (spies) для проверки вызова событий:

   ```typescript
   const spy = spyOn(fixture.componentInstance.outputEvent, "emit");
   const button = fixture.nativeElement.querySelector("button");
   button.click();
   expect(spy).toHaveBeenCalledWith(ожидаемое_значение);
   ```

3. **Тестирование взаимодействия родительского и дочернего компонентов**: Создайте тестовый враппер-компонент, который содержит тестируемый компонент с привязанными входными параметрами и выходными событиями:

   ```typescript
   @Component({
     template: `<app-child
       [input]="data"
       (outputEvent)="handleEvent($event)"
     ></app-child>`,
   })
   class TestHostComponent {
     data = "test";
     eventValue: any;
     handleEvent(value: any) {
       this.eventValue = value;
     }
   }
   ```

4. **Тестирование с использованием DebugElement**: Используйте `DebugElement` для более гибкого доступа к DOM и событиям:

   ```typescript
   const debugEl = fixture.debugElement.query(By.css(".trigger-button"));
   debugEl.triggerEventHandler("click", {});
   fixture.detectChanges();
   ```

5. **Использование fakeAsync для асинхронных тестов**: Когда события запускают асинхронные операции, используйте `fakeAsync` и `tick`:
   ```typescript
   it("должен эмитить событие после задержки", fakeAsync(() => {
     const spy = spyOn(component.delayedEvent, "emit");
     component.triggerDelayedEvent();
     tick(1000);
     expect(spy).toHaveBeenCalled();
   }));
   ```
   </div>
   </details>

##### Code convention

<details>
<summary>Требования к написанию кода на TypeScript</summary>
<div>
  
<br>

На самом деле требования бывают разные и зависят от команды к команде.
Самые эффективные для себя считаю использование модификаторов доступа и принудительного указания типов данных для всех переменных,
методов и членов класса, которые вы используете в коде. Желательно все необходимые правила конвенции кода настраивать в ESLint.

```ts
// my.ts
export interface My {}

// my-impl.ts
export class MyImp implements My {
  public field: string;

  public myMethod(): void {
    // ...
  }

  private myProtectedMethod(): Date {
    return new Date();
  }

  private myPrivateMethod(): MyClassImpl {
    // ...

    return this;
  }
}
```

</div>Как протестировать входные параметры и всплывающие события компонентов
</details>

<details>
<summary>Зачем нужен ESLint (TSLint) и Prettier?</summary>
<div>
  1. **ESLint (ранее TSLint)** — инструмент статического анализа кода, который проверяет соответствие кода заданным правилам и стандартам. В Angular используется для обнаружения проблемных шаблонов в TypeScript-коде, потенциальных ошибок и несоответствий стилю кодирования. ESLint помогает поддерживать качество кода, обеспечивая его соответствие общепринятым стандартам и лучшим практикам.

2. **Prettier** — инструмент форматирования кода, который автоматически преобразует код в соответствии с заданным правилам форматирования. В отличие от ESLint, Prettier не анализирует логику кода, а занимается исключительно его форматированием: расстановкой отступов, переносами строк, кавычками и т.д. Это значительно экономит время на форматировании кода вручную.

3. **Совместное использование ESLint и Prettier** обеспечивает как анализ качества кода, так и его единообразное форматирование. Для интеграции используются пакеты `eslint-config-prettier` и `eslint-plugin-prettier`, которые устраняют конфликты между правилами ESLint и форматированием Prettier. Такая комбинация позволяет получить максимальную пользу от обоих инструментов.

4. **Преимущества для командной разработки**: ESLint и Prettier обеспечивают единый стиль кодирования для всей команды, что упрощает чтение и понимание кода другими разработчиками. При настройке через конфигурационные файлы (`.eslintrc`, `.prettierrc`) эти стандарты могут быть легко распространены на весь проект и автоматически применяться при коммитах через хуки.

5. **Интеграция с Angular**: В современных проектах Angular ESLint полностью заменил устаревший TSLint, который больше не поддерживается. Команда Angular создала набор правил специально для проектов Angular (`@angular-eslint`), который включает проверки шаблонов компонентов, правильного использования декораторов и других специфичных для Angular паттернов.
</div>
</details>

# Типы тестирования в Angular

<details>
<summary>Что такое Unit-тестирование и как оно применяется в Angular?</summary>

Unit-тестирование (модульное тестирование) — это тестирование отдельных изолированных частей кода (функций, методов, классов) вне зависимости от других компонентов. В Angular unit-тесты написаны с помощью Jasmine или Jest и выполняются через Karma или Angular CLI.

Применение в Angular:

- Тестирование сервисов (проверка методов, HTTP-запросов)
- Тестирование pipe-компонентов
- Тестирование изолированных компонентов (без DOM-взаимодействия)
- Тестирование утилитарных функций

Пример unit-теста сервиса в Angular:

```typescript
describe("TodoService", () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("должен получить список задач", () => {
    const mockTodos = [
      { id: 1, title: "Задача 1", completed: false },
      { id: 2, title: "Задача 2", completed: true },
    ];

    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne("api/todos");
    expect(req.request.method).toBe("GET");
    req.flush(mockTodos);
  });
});
```

</details>

<details>
<summary>Что такое интеграционное тестирование и как оно применяется в Angular?</summary>

Интеграционное тестирование — это проверка взаимодействия между разными модулями, компонентами или сервисами. В Angular это включает тестирование взаимодействия компонентов с сервисами, директивами и DOM.

Применение в Angular:

- Тестирование компонентов с их шаблонами
- Тестирование взаимодействия родительских/дочерних компонентов
- Тестирование взаимодействия компонентов с сервисами
- Тестирование директив в контексте компонентов

Пример интеграционного теста в Angular:

```typescript
describe("TodoComponent", () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("TodoService", ["getTodos", "addTodo"]);

    await TestBed.configureTestingModule({
      declarations: [TodoComponent, TodoItemComponent],
      providers: [{ provide: TodoService, useValue: spy }],
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    todoService.getTodos.and.returnValue(
      of([{ id: 1, title: "Задача 1", completed: false }])
    );

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("должен отображать список задач", () => {
    const todoItems = fixture.debugElement.queryAll(By.css(".todo-item"));
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].nativeElement.textContent).toContain("Задача 1");
  });

  it("должен добавлять новую задачу", () => {
    todoService.addTodo.and.returnValue(
      of({ id: 2, title: "Новая задача", completed: false })
    );

    const input = fixture.debugElement.query(By.css("input")).nativeElement;
    input.value = "Новая задача";
    input.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.query(By.css("button")).nativeElement;
    button.click();

    expect(todoService.addTodo).toHaveBeenCalledWith("Новая задача");
  });
});
```

</details>

<details>
<summary>Что такое E2E-тестирование и как оно применяется в Angular?</summary>

E2E-тестирование (End-to-End) — это тестирование всего приложения с точки зрения пользователя, имитирующее реальные сценарии использования. E2E-тесты запускаются в реальном браузере и взаимодействуют с приложением как настоящий пользователь.

Применение в Angular:

- Тестирование пользовательских сценариев от начала до конца
- Проверка всего потока данных через приложение
- Тестирование маршрутизации и навигации
- Проверка интеграции всех компонентов в конечное приложение

Раньше в Angular использовался Protractor, теперь рекомендуются Cypress, Playwright или Selenium WebDriver.

Пример E2E-теста с использованием Cypress для Angular:

```typescript
describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("должен добавлять новую задачу", () => {
    cy.get('input[placeholder="Добавить задачу"]').type("Новая E2E задача");
    cy.get("button").contains("Добавить").click();
    cy.get(".todo-list").should("contain", "Новая E2E задача");
  });

  it("должен отмечать задачу как выполненную", () => {
    // Добавляем задачу
    cy.get('input[placeholder="Добавить задачу"]').type(
      "Задача для выполнения"
    );
    cy.get("button").contains("Добавить").click();

    // Отмечаем как выполненную
    cy.get(".todo-item")
      .contains("Задача для выполнения")
      .parent()
      .find('input[type="checkbox"]')
      .check();

    // Проверяем, что задача отмечена
    cy.get(".todo-item.completed").should("contain", "Задача для выполнения");
  });

  it("должен фильтровать задачи", () => {
    // Добавляем задачи
    cy.get('input[placeholder="Добавить задачу"]').type("Активная задача");
    cy.get("button").contains("Добавить").click();

    cy.get('input[placeholder="Добавить задачу"]').type("Выполненная задача");
    cy.get("button").contains("Добавить").click();

    // Отмечаем вторую как выполненную
    cy.get(".todo-item")
      .contains("Выполненная задача")
      .parent()
      .find('input[type="checkbox"]')
      .check();

    // Фильтруем активные
    cy.get("button").contains("Активные").click();
    cy.get(".todo-list").should("contain", "Активная задача");
    cy.get(".todo-list").should("not.contain", "Выполненная задача");

    // Фильтруем выполненные
    cy.get("button").contains("Выполненные").click();
    cy.get(".todo-list").should("not.contain", "Активная задача");
    cy.get(".todo-list").should("contain", "Выполненная задача");
  });
});
```

</details>

<details>
<summary>Как выбрать правильный тип тестирования для Angular-приложения?</summary>

Выбор типа тестирования зависит от целей и требований проекта:

1. **Unit-тесты** следует использовать для:

   - Проверки бизнес-логики и алгоритмов
   - Тестирования сервисов и утилит
   - Обеспечения высокого покрытия кода
   - Раннего обнаружения регрессий

2. **Интеграционные тесты** нужны для:

   - Проверки взаимодействия компонентов
   - Тестирования потока данных между частями приложения
   - Проверки правильности взаимодействия компонентов с DOM

3. **E2E-тесты** следует применять для:
   - Проверки критических пользовательских сценариев
   - Тестирования полных потоков данных через приложение
   - Проверки готового пользовательского интерфейса

Оптимальное соотношение тестов в Angular-приложении:

- 70% unit-тестов (быстрые, легко поддерживаемые)
- 20% интеграционных тестов (покрывают взаимодействия)
- 10% E2E-тестов (проверяют критические бизнес-сценарии)

Выбор инструментов тестирования:

- Unit-тесты: Jasmine/Jest с Karma
- Интеграционные тесты: TestBed и компоненты Angular для тестирования
- E2E-тесты: Cypress, Playwright или другие современные инструменты
</details>

<details>
<summary>Стратегии мокирования в различных типах тестирования Angular</summary>

Мокирование — важный аспект тестирования, позволяющий изолировать тестируемый код от внешних зависимостей.

**Unit-тестирование:**

- Используйте `jasmine.createSpyObj()` для создания моков сервисов
- Подменяйте HTTP-запросы через `HttpClientTestingModule`
- Изолируйте компоненты от их шаблонов для чистых unit-тестов

```typescript
// Мок сервиса для unit-теста
const todoServiceMock = jasmine.createSpyObj("TodoService", [
  "getTodos",
  "addTodo",
  "deleteTodo",
]);
todoServiceMock.getTodos.and.returnValue(
  of([{ id: 1, title: "Тестовая задача", completed: false }])
);
```

**Интеграционное тестирование:**

- Используйте `TestBed.configureTestingModule()` для настройки среды тестирования
- Применяйте настоящие компоненты с мок-сервисами
- При необходимости используйте стабы дочерних компонентов

```typescript
// Настройка модуля для интеграционного теста
TestBed.configureTestingModule({
  declarations: [
    TodoComponent,
    // Мок компонента с @Component декоратором
    MockComponent(TodoItemComponent),
  ],
  providers: [{ provide: TodoService, useValue: todoServiceMock }],
});
```

**E2E-тестирование:**

- Используйте мокирование API через перехват сетевых запросов
- Для Cypress подойдет `cy.intercept()`
- Создавайте фикстуры для данных API

```typescript
// Мокирование API в Cypress
cy.intercept("GET", "/api/todos", {
  fixture: "todos.json",
}).as("getTodos");

cy.visit("/todos");
cy.wait("@getTodos");
```

**Лучшие практики мокирования:**

1. Мокируйте только внешние зависимости, не внутренние методы классов
2. Создавайте фабрики для генерации тестовых данных
3. Используйте типизированные моки для лучшей поддержки TypeScript
4. Не мокируйте Angular-компоненты в E2E-тестах, мокируйте только API
5. Правильно настраивайте моки для асинхронных операций, используя обещания или Observable
</details>

# Ответы на вопросы по тестированию в Angular

<details>
<summary><b>Что такое Unit-тестирование, интеграционное, e2e-тестирование (End-to-End) и как оно применяется в Angular?</b></summary>

1. **Unit-тестирование** — методика тестирования отдельных изолированных компонентов/функций/модулей приложения. В Angular используется для проверки логики сервисов, компонентов и пайпов в изоляции от других частей приложения. Для этого применяются моки и стабы зависимостей. В Angular осуществляется с помощью TestBed API.

2. **Интеграционное тестирование** — проверяет взаимодействие между несколькими модулями/компонентами приложения. В Angular тестируется взаимодействие компонентов с их дочерними компонентами, сервисами и директивами. TestBed позволяет создавать тестовые модули, включающие необходимые зависимости.

3. **E2E-тестирование** — имитирует взаимодействие пользователя с приложением от начала до конца, проверяя работу всей системы в целом. Для Angular традиционно использовался Protractor, но сейчас рекомендуется использовать Cypress или Playwright.

4. **Применение в Angular**: Unit-тесты используют TestBed для имитации Angular окружения; интеграционные тесты проверяют компоненты с их шаблонами и сервисами; e2e-тесты могут использовать Cypress для проверки пользовательских сценариев.

5. **Структура тестов в Angular**: Файлы тестов обычно имеют расширение `.spec.ts` и располагаются рядом с тестируемыми файлами. Запуск тестов осуществляется командой `ng test` для модульных тестов и `ng e2e` для e2e-тестов.
</details>

<details>
<summary><b>Что такое Karma, Jasmine (зачем их используют совместно при разработке на Angular)?</b></summary>

1. **Jasmine** — фреймворк для тестирования JavaScript, предоставляющий функции для написания тестов (describe, it, expect). Он не требует DOM и отличается простым синтаксисом. В контексте Angular используется для определения структуры тестов и написания утверждений.

2. **Karma** — тест-раннер, разработанный командой Angular для запуска JavaScript-тестов в реальных браузерах. Karma запускает спецификации Jasmine в различных браузерах, собирает результаты и выводит отчёты.

3. **Использование совместно**: Jasmine определяет структуру и содержание тестов, а Karma обеспечивает их выполнение в браузере. Такая комбинация позволяет тестировать взаимодействие кода с DOM-API и проверять совместимость с различными браузерами.

4. **Конфигурация в Angular**: При создании проекта через Angular CLI автоматически настраиваются Karma (karma.conf.js) и Jasmine. Это упрощает запуск тестов командой `ng test` без дополнительной настройки.

5. **Преимущества совместного использования**: Jasmine предоставляет понятный человеку синтаксис для описания ожидаемого поведения, а Karma обеспечивает автоматизацию запуска тестов в различных средах, что делает их идеальной комбинацией для разработки на Angular.
</details>

<details>
<summary><b>В чем разница между Jest и Karma?</b></summary>

1. **Окружение выполнения**: Karma запускает тесты в реальных браузерах (Chrome, Firefox и т.д.), тогда как Jest запускает тесты в среде Node.js с использованием JSDOM для эмуляции браузерного API. Это делает Jest быстрее, но Karma даёт более точную проверку совместимости с браузерами.

2. **Скорость и параллелизм**: Jest выполняет тесты параллельно и изолированно, что значительно ускоряет процесс тестирования. Karma запускает тесты последовательно, что медленнее, особенно при большом количестве тестов.

3. **Встроенные возможности**: Jest предоставляет всё необходимое "из коробки": средства мокирования, снапшот-тестирование, coverage-отчёты. Karma требует дополнительных плагинов и интеграции с другими инструментами (например, Jasmine или Mocha).

4. **Настройка и конфигурация**: Jest имеет минимальные требования к настройке и хорошо работает с нулевой конфигурацией. Karma требует более сложной настройки с определением браузеров, фреймворков и репортеров.

5. **Совместимость с Angular**: Karma традиционно использовалась в Angular, однако начиная с Angular 12+ стало возможным настроить проект с Jest вместо Karma/Jasmine. Jest становится популярнее благодаря скорости и удобству, хотя требует дополнительной настройки для интеграции с Angular.
</details>

<details>
<summary><b>В чем разница между Protractor и Cypress?</b></summary>

1. **Архитектура**: Protractor построен на Selenium WebDriver и работает через отдельный процесс, управляющий браузером. Cypress работает непосредственно в браузере, выполняя тесты в том же контексте, что и тестируемое приложение, что обеспечивает более стабильное и быстрое выполнение.

2. **Асинхронность**: Protractor использует WebDriverJS и промисы для асинхронных операций, что усложняет отладку. Cypress автоматически ожидает завершения асинхронных операций и предоставляет более понятную модель для работы с асинхронностью.

3. **Отладка и визуализация**: Cypress предлагает превосходные инструменты отладки: снимки DOM на каждом шаге, запись видео, временная шкала выполнения тестов. Protractor имеет более ограниченные возможности отладки и требует дополнительной настройки для визуализации.

4. **Интеграция с Angular**: Protractor был разработан специально для Angular и имеет встроенную поддержку NgZone и стабилизации приложения. Cypress не имеет специальной интеграции с Angular, но хорошо работает с любыми фреймворками благодаря своему подходу к выполнению команд.

5. **Будущее развитие**: Protractor официально устарел и не рекомендуется для новых проектов на Angular. Команда Angular рекомендует использовать Cypress, Playwright или WebdriverIO вместо Protractor. Cypress активно развивается и имеет большое сообщество.
</details>

<details>
<summary><b>Как протестировать входные параметры и всплывающие события компонентов?</b></summary>

1. **Тестирование входных параметров**: Создайте экземпляр компонента через TestBed, используя `componentInstance` для прямой установки входных параметров:

   ```typescript
   const fixture = TestBed.createComponent(MyComponent);
   fixture.componentInstance.inputProperty = testValue;
   fixture.detectChanges();
   expect(fixture.nativeElement.textContent).toContain("ожидаемый результат");
   ```

2. **Тестирование всплывающих событий**: Используйте шпионы (spies) для проверки вызова событий:

   ```typescript
   const spy = spyOn(fixture.componentInstance.outputEvent, "emit");
   const button = fixture.nativeElement.querySelector("button");
   button.click();
   expect(spy).toHaveBeenCalledWith(ожидаемое_значение);
   ```

3. **Тестирование взаимодействия родительского и дочернего компонентов**: Создайте тестовый враппер-компонент, который содержит тестируемый компонент с привязанными входными параметрами и выходными событиями:

   ```typescript
   @Component({
     template: `<app-child
       [input]="data"
       (outputEvent)="handleEvent($event)"
     ></app-child>`,
   })
   class TestHostComponent {
     data = "test";
     eventValue: any;
     handleEvent(value: any) {
       this.eventValue = value;
     }
   }
   ```

4. **Тестирование с использованием DebugElement**: Используйте `DebugElement` для более гибкого доступа к DOM и событиям:

   ```typescript
   const debugEl = fixture.debugElement.query(By.css(".trigger-button"));
   debugEl.triggerEventHandler("click", {});
   fixture.detectChanges();
   ```

5. **Использование fakeAsync для асинхронных тестов**: Когда события запускают асинхронные операции, используйте `fakeAsync` и `tick`:
   ```typescript
   it("должен эмитить событие после задержки", fakeAsync(() => {
     const spy = spyOn(component.delayedEvent, "emit");
     component.triggerDelayedEvent();
     tick(1000);
     expect(spy).toHaveBeenCalled();
   }));
   ```
   </details>
