
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model EpisodeFeedback
 * 
 */
export type EpisodeFeedback = $Result.DefaultSelection<Prisma.$EpisodeFeedbackPayload>
/**
 * Model Bundle
 * 
 */
export type Bundle = $Result.DefaultSelection<Prisma.$BundlePayload>
/**
 * Model BundlePodcast
 * 
 */
export type BundlePodcast = $Result.DefaultSelection<Prisma.$BundlePodcastPayload>
/**
 * Model Episode
 * 
 */
export type Episode = $Result.DefaultSelection<Prisma.$EpisodePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model Podcast
 * 
 */
export type Podcast = $Result.DefaultSelection<Prisma.$PodcastPayload>
/**
 * Model ProfilePodcast
 * 
 */
export type ProfilePodcast = $Result.DefaultSelection<Prisma.$ProfilePodcastPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserCurationProfile
 * 
 */
export type UserCurationProfile = $Result.DefaultSelection<Prisma.$UserCurationProfilePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FeedbackRating: {
  THUMBS_UP: 'THUMBS_UP',
  THUMBS_DOWN: 'THUMBS_DOWN',
  NEUTRAL: 'NEUTRAL'
};

export type FeedbackRating = (typeof FeedbackRating)[keyof typeof FeedbackRating]

}

export type FeedbackRating = $Enums.FeedbackRating

export const FeedbackRating: typeof $Enums.FeedbackRating

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EpisodeFeedbacks
 * const episodeFeedbacks = await prisma.episodeFeedback.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EpisodeFeedbacks
   * const episodeFeedbacks = await prisma.episodeFeedback.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.episodeFeedback`: Exposes CRUD operations for the **EpisodeFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EpisodeFeedbacks
    * const episodeFeedbacks = await prisma.episodeFeedback.findMany()
    * ```
    */
  get episodeFeedback(): Prisma.EpisodeFeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bundle`: Exposes CRUD operations for the **Bundle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bundles
    * const bundles = await prisma.bundle.findMany()
    * ```
    */
  get bundle(): Prisma.BundleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bundlePodcast`: Exposes CRUD operations for the **BundlePodcast** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BundlePodcasts
    * const bundlePodcasts = await prisma.bundlePodcast.findMany()
    * ```
    */
  get bundlePodcast(): Prisma.BundlePodcastDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.episode`: Exposes CRUD operations for the **Episode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Episodes
    * const episodes = await prisma.episode.findMany()
    * ```
    */
  get episode(): Prisma.EpisodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.podcast`: Exposes CRUD operations for the **Podcast** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Podcasts
    * const podcasts = await prisma.podcast.findMany()
    * ```
    */
  get podcast(): Prisma.PodcastDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profilePodcast`: Exposes CRUD operations for the **ProfilePodcast** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfilePodcasts
    * const profilePodcasts = await prisma.profilePodcast.findMany()
    * ```
    */
  get profilePodcast(): Prisma.ProfilePodcastDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userCurationProfile`: Exposes CRUD operations for the **UserCurationProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCurationProfiles
    * const userCurationProfiles = await prisma.userCurationProfile.findMany()
    * ```
    */
  get userCurationProfile(): Prisma.UserCurationProfileDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EpisodeFeedback: 'EpisodeFeedback',
    Bundle: 'Bundle',
    BundlePodcast: 'BundlePodcast',
    Episode: 'Episode',
    Notification: 'Notification',
    Podcast: 'Podcast',
    ProfilePodcast: 'ProfilePodcast',
    Subscription: 'Subscription',
    User: 'User',
    UserCurationProfile: 'UserCurationProfile'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "episodeFeedback" | "bundle" | "bundlePodcast" | "episode" | "notification" | "podcast" | "profilePodcast" | "subscription" | "user" | "userCurationProfile"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EpisodeFeedback: {
        payload: Prisma.$EpisodeFeedbackPayload<ExtArgs>
        fields: Prisma.EpisodeFeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EpisodeFeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EpisodeFeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          findFirst: {
            args: Prisma.EpisodeFeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EpisodeFeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          findMany: {
            args: Prisma.EpisodeFeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>[]
          }
          create: {
            args: Prisma.EpisodeFeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          createMany: {
            args: Prisma.EpisodeFeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EpisodeFeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>[]
          }
          delete: {
            args: Prisma.EpisodeFeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          update: {
            args: Prisma.EpisodeFeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          deleteMany: {
            args: Prisma.EpisodeFeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EpisodeFeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EpisodeFeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>[]
          }
          upsert: {
            args: Prisma.EpisodeFeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodeFeedbackPayload>
          }
          aggregate: {
            args: Prisma.EpisodeFeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEpisodeFeedback>
          }
          groupBy: {
            args: Prisma.EpisodeFeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<EpisodeFeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.EpisodeFeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<EpisodeFeedbackCountAggregateOutputType> | number
          }
        }
      }
      Bundle: {
        payload: Prisma.$BundlePayload<ExtArgs>
        fields: Prisma.BundleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BundleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BundleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          findFirst: {
            args: Prisma.BundleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BundleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          findMany: {
            args: Prisma.BundleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>[]
          }
          create: {
            args: Prisma.BundleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          createMany: {
            args: Prisma.BundleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BundleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>[]
          }
          delete: {
            args: Prisma.BundleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          update: {
            args: Prisma.BundleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          deleteMany: {
            args: Prisma.BundleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BundleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BundleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>[]
          }
          upsert: {
            args: Prisma.BundleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePayload>
          }
          aggregate: {
            args: Prisma.BundleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundle>
          }
          groupBy: {
            args: Prisma.BundleGroupByArgs<ExtArgs>
            result: $Utils.Optional<BundleGroupByOutputType>[]
          }
          count: {
            args: Prisma.BundleCountArgs<ExtArgs>
            result: $Utils.Optional<BundleCountAggregateOutputType> | number
          }
        }
      }
      BundlePodcast: {
        payload: Prisma.$BundlePodcastPayload<ExtArgs>
        fields: Prisma.BundlePodcastFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BundlePodcastFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BundlePodcastFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          findFirst: {
            args: Prisma.BundlePodcastFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BundlePodcastFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          findMany: {
            args: Prisma.BundlePodcastFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>[]
          }
          create: {
            args: Prisma.BundlePodcastCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          createMany: {
            args: Prisma.BundlePodcastCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BundlePodcastCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>[]
          }
          delete: {
            args: Prisma.BundlePodcastDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          update: {
            args: Prisma.BundlePodcastUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          deleteMany: {
            args: Prisma.BundlePodcastDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BundlePodcastUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BundlePodcastUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>[]
          }
          upsert: {
            args: Prisma.BundlePodcastUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BundlePodcastPayload>
          }
          aggregate: {
            args: Prisma.BundlePodcastAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundlePodcast>
          }
          groupBy: {
            args: Prisma.BundlePodcastGroupByArgs<ExtArgs>
            result: $Utils.Optional<BundlePodcastGroupByOutputType>[]
          }
          count: {
            args: Prisma.BundlePodcastCountArgs<ExtArgs>
            result: $Utils.Optional<BundlePodcastCountAggregateOutputType> | number
          }
        }
      }
      Episode: {
        payload: Prisma.$EpisodePayload<ExtArgs>
        fields: Prisma.EpisodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EpisodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EpisodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          findFirst: {
            args: Prisma.EpisodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EpisodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          findMany: {
            args: Prisma.EpisodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>[]
          }
          create: {
            args: Prisma.EpisodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          createMany: {
            args: Prisma.EpisodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EpisodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>[]
          }
          delete: {
            args: Prisma.EpisodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          update: {
            args: Prisma.EpisodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          deleteMany: {
            args: Prisma.EpisodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EpisodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EpisodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>[]
          }
          upsert: {
            args: Prisma.EpisodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EpisodePayload>
          }
          aggregate: {
            args: Prisma.EpisodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEpisode>
          }
          groupBy: {
            args: Prisma.EpisodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EpisodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EpisodeCountArgs<ExtArgs>
            result: $Utils.Optional<EpisodeCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      Podcast: {
        payload: Prisma.$PodcastPayload<ExtArgs>
        fields: Prisma.PodcastFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PodcastFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PodcastFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          findFirst: {
            args: Prisma.PodcastFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PodcastFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          findMany: {
            args: Prisma.PodcastFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>[]
          }
          create: {
            args: Prisma.PodcastCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          createMany: {
            args: Prisma.PodcastCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PodcastCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>[]
          }
          delete: {
            args: Prisma.PodcastDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          update: {
            args: Prisma.PodcastUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          deleteMany: {
            args: Prisma.PodcastDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PodcastUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PodcastUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>[]
          }
          upsert: {
            args: Prisma.PodcastUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PodcastPayload>
          }
          aggregate: {
            args: Prisma.PodcastAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePodcast>
          }
          groupBy: {
            args: Prisma.PodcastGroupByArgs<ExtArgs>
            result: $Utils.Optional<PodcastGroupByOutputType>[]
          }
          count: {
            args: Prisma.PodcastCountArgs<ExtArgs>
            result: $Utils.Optional<PodcastCountAggregateOutputType> | number
          }
        }
      }
      ProfilePodcast: {
        payload: Prisma.$ProfilePodcastPayload<ExtArgs>
        fields: Prisma.ProfilePodcastFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfilePodcastFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfilePodcastFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          findFirst: {
            args: Prisma.ProfilePodcastFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfilePodcastFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          findMany: {
            args: Prisma.ProfilePodcastFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>[]
          }
          create: {
            args: Prisma.ProfilePodcastCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          createMany: {
            args: Prisma.ProfilePodcastCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfilePodcastCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>[]
          }
          delete: {
            args: Prisma.ProfilePodcastDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          update: {
            args: Prisma.ProfilePodcastUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          deleteMany: {
            args: Prisma.ProfilePodcastDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfilePodcastUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfilePodcastUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>[]
          }
          upsert: {
            args: Prisma.ProfilePodcastUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePodcastPayload>
          }
          aggregate: {
            args: Prisma.ProfilePodcastAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfilePodcast>
          }
          groupBy: {
            args: Prisma.ProfilePodcastGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfilePodcastGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfilePodcastCountArgs<ExtArgs>
            result: $Utils.Optional<ProfilePodcastCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserCurationProfile: {
        payload: Prisma.$UserCurationProfilePayload<ExtArgs>
        fields: Prisma.UserCurationProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserCurationProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserCurationProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          findFirst: {
            args: Prisma.UserCurationProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserCurationProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          findMany: {
            args: Prisma.UserCurationProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>[]
          }
          create: {
            args: Prisma.UserCurationProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          createMany: {
            args: Prisma.UserCurationProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCurationProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>[]
          }
          delete: {
            args: Prisma.UserCurationProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          update: {
            args: Prisma.UserCurationProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserCurationProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserCurationProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserCurationProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserCurationProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCurationProfilePayload>
          }
          aggregate: {
            args: Prisma.UserCurationProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserCurationProfile>
          }
          groupBy: {
            args: Prisma.UserCurationProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserCurationProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCurationProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserCurationProfileCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    episodeFeedback?: EpisodeFeedbackOmit
    bundle?: BundleOmit
    bundlePodcast?: BundlePodcastOmit
    episode?: EpisodeOmit
    notification?: NotificationOmit
    podcast?: PodcastOmit
    profilePodcast?: ProfilePodcastOmit
    subscription?: SubscriptionOmit
    user?: UserOmit
    userCurationProfile?: UserCurationProfileOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BundleCountOutputType
   */

  export type BundleCountOutputType = {
    bundle_podcast: number
    episode: number
    user_curation_profile: number
  }

  export type BundleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle_podcast?: boolean | BundleCountOutputTypeCountBundle_podcastArgs
    episode?: boolean | BundleCountOutputTypeCountEpisodeArgs
    user_curation_profile?: boolean | BundleCountOutputTypeCountUser_curation_profileArgs
  }

  // Custom InputTypes
  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleCountOutputType
     */
    select?: BundleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountBundle_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundlePodcastWhereInput
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountEpisodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeWhereInput
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountUser_curation_profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCurationProfileWhereInput
  }


  /**
   * Count Type EpisodeCountOutputType
   */

  export type EpisodeCountOutputType = {
    feedback: number
  }

  export type EpisodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedback?: boolean | EpisodeCountOutputTypeCountFeedbackArgs
  }

  // Custom InputTypes
  /**
   * EpisodeCountOutputType without action
   */
  export type EpisodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeCountOutputType
     */
    select?: EpisodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EpisodeCountOutputType without action
   */
  export type EpisodeCountOutputTypeCountFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeFeedbackWhereInput
  }


  /**
   * Count Type PodcastCountOutputType
   */

  export type PodcastCountOutputType = {
    bundle_podcast: number
    episode: number
    profile_podcast: number
  }

  export type PodcastCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle_podcast?: boolean | PodcastCountOutputTypeCountBundle_podcastArgs
    episode?: boolean | PodcastCountOutputTypeCountEpisodeArgs
    profile_podcast?: boolean | PodcastCountOutputTypeCountProfile_podcastArgs
  }

  // Custom InputTypes
  /**
   * PodcastCountOutputType without action
   */
  export type PodcastCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PodcastCountOutputType
     */
    select?: PodcastCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PodcastCountOutputType without action
   */
  export type PodcastCountOutputTypeCountBundle_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundlePodcastWhereInput
  }

  /**
   * PodcastCountOutputType without action
   */
  export type PodcastCountOutputTypeCountEpisodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeWhereInput
  }

  /**
   * PodcastCountOutputType without action
   */
  export type PodcastCountOutputTypeCountProfile_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfilePodcastWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bundle: number
    feedback: number
    notification: number
    podcast: number
    subscription: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | UserCountOutputTypeCountBundleArgs
    feedback?: boolean | UserCountOutputTypeCountFeedbackArgs
    notification?: boolean | UserCountOutputTypeCountNotificationArgs
    podcast?: boolean | UserCountOutputTypeCountPodcastArgs
    subscription?: boolean | UserCountOutputTypeCountSubscriptionArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeFeedbackWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPodcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PodcastWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }


  /**
   * Count Type UserCurationProfileCountOutputType
   */

  export type UserCurationProfileCountOutputType = {
    episode: number
    profile_podcast: number
  }

  export type UserCurationProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    episode?: boolean | UserCurationProfileCountOutputTypeCountEpisodeArgs
    profile_podcast?: boolean | UserCurationProfileCountOutputTypeCountProfile_podcastArgs
  }

  // Custom InputTypes
  /**
   * UserCurationProfileCountOutputType without action
   */
  export type UserCurationProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfileCountOutputType
     */
    select?: UserCurationProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCurationProfileCountOutputType without action
   */
  export type UserCurationProfileCountOutputTypeCountEpisodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeWhereInput
  }

  /**
   * UserCurationProfileCountOutputType without action
   */
  export type UserCurationProfileCountOutputTypeCountProfile_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfilePodcastWhereInput
  }


  /**
   * Models
   */

  /**
   * Model EpisodeFeedback
   */

  export type AggregateEpisodeFeedback = {
    _count: EpisodeFeedbackCountAggregateOutputType | null
    _min: EpisodeFeedbackMinAggregateOutputType | null
    _max: EpisodeFeedbackMaxAggregateOutputType | null
  }

  export type EpisodeFeedbackMinAggregateOutputType = {
    feedback_id: string | null
    userId: string | null
    episodeId: string | null
    rating: $Enums.FeedbackRating | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EpisodeFeedbackMaxAggregateOutputType = {
    feedback_id: string | null
    userId: string | null
    episodeId: string | null
    rating: $Enums.FeedbackRating | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EpisodeFeedbackCountAggregateOutputType = {
    feedback_id: number
    userId: number
    episodeId: number
    rating: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EpisodeFeedbackMinAggregateInputType = {
    feedback_id?: true
    userId?: true
    episodeId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EpisodeFeedbackMaxAggregateInputType = {
    feedback_id?: true
    userId?: true
    episodeId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EpisodeFeedbackCountAggregateInputType = {
    feedback_id?: true
    userId?: true
    episodeId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EpisodeFeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EpisodeFeedback to aggregate.
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EpisodeFeedbacks to fetch.
     */
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EpisodeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EpisodeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EpisodeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EpisodeFeedbacks
    **/
    _count?: true | EpisodeFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EpisodeFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EpisodeFeedbackMaxAggregateInputType
  }

  export type GetEpisodeFeedbackAggregateType<T extends EpisodeFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateEpisodeFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEpisodeFeedback[P]>
      : GetScalarType<T[P], AggregateEpisodeFeedback[P]>
  }




  export type EpisodeFeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeFeedbackWhereInput
    orderBy?: EpisodeFeedbackOrderByWithAggregationInput | EpisodeFeedbackOrderByWithAggregationInput[]
    by: EpisodeFeedbackScalarFieldEnum[] | EpisodeFeedbackScalarFieldEnum
    having?: EpisodeFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EpisodeFeedbackCountAggregateInputType | true
    _min?: EpisodeFeedbackMinAggregateInputType
    _max?: EpisodeFeedbackMaxAggregateInputType
  }

  export type EpisodeFeedbackGroupByOutputType = {
    feedback_id: string
    userId: string
    episodeId: string
    rating: $Enums.FeedbackRating
    createdAt: Date
    updatedAt: Date
    _count: EpisodeFeedbackCountAggregateOutputType | null
    _min: EpisodeFeedbackMinAggregateOutputType | null
    _max: EpisodeFeedbackMaxAggregateOutputType | null
  }

  type GetEpisodeFeedbackGroupByPayload<T extends EpisodeFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EpisodeFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EpisodeFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EpisodeFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], EpisodeFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type EpisodeFeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedback_id?: boolean
    userId?: boolean
    episodeId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["episodeFeedback"]>

  export type EpisodeFeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedback_id?: boolean
    userId?: boolean
    episodeId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["episodeFeedback"]>

  export type EpisodeFeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    feedback_id?: boolean
    userId?: boolean
    episodeId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["episodeFeedback"]>

  export type EpisodeFeedbackSelectScalar = {
    feedback_id?: boolean
    userId?: boolean
    episodeId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EpisodeFeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"feedback_id" | "userId" | "episodeId" | "rating" | "createdAt" | "updatedAt", ExtArgs["result"]["episodeFeedback"]>
  export type EpisodeFeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EpisodeFeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EpisodeFeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    episode?: boolean | EpisodeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EpisodeFeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EpisodeFeedback"
    objects: {
      episode: Prisma.$EpisodePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      feedback_id: string
      userId: string
      episodeId: string
      rating: $Enums.FeedbackRating
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["episodeFeedback"]>
    composites: {}
  }

  type EpisodeFeedbackGetPayload<S extends boolean | null | undefined | EpisodeFeedbackDefaultArgs> = $Result.GetResult<Prisma.$EpisodeFeedbackPayload, S>

  type EpisodeFeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EpisodeFeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EpisodeFeedbackCountAggregateInputType | true
    }

  export interface EpisodeFeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EpisodeFeedback'], meta: { name: 'EpisodeFeedback' } }
    /**
     * Find zero or one EpisodeFeedback that matches the filter.
     * @param {EpisodeFeedbackFindUniqueArgs} args - Arguments to find a EpisodeFeedback
     * @example
     * // Get one EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EpisodeFeedbackFindUniqueArgs>(args: SelectSubset<T, EpisodeFeedbackFindUniqueArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EpisodeFeedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EpisodeFeedbackFindUniqueOrThrowArgs} args - Arguments to find a EpisodeFeedback
     * @example
     * // Get one EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EpisodeFeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, EpisodeFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EpisodeFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackFindFirstArgs} args - Arguments to find a EpisodeFeedback
     * @example
     * // Get one EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EpisodeFeedbackFindFirstArgs>(args?: SelectSubset<T, EpisodeFeedbackFindFirstArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EpisodeFeedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackFindFirstOrThrowArgs} args - Arguments to find a EpisodeFeedback
     * @example
     * // Get one EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EpisodeFeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, EpisodeFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EpisodeFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EpisodeFeedbacks
     * const episodeFeedbacks = await prisma.episodeFeedback.findMany()
     * 
     * // Get first 10 EpisodeFeedbacks
     * const episodeFeedbacks = await prisma.episodeFeedback.findMany({ take: 10 })
     * 
     * // Only select the `feedback_id`
     * const episodeFeedbackWithFeedback_idOnly = await prisma.episodeFeedback.findMany({ select: { feedback_id: true } })
     * 
     */
    findMany<T extends EpisodeFeedbackFindManyArgs>(args?: SelectSubset<T, EpisodeFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EpisodeFeedback.
     * @param {EpisodeFeedbackCreateArgs} args - Arguments to create a EpisodeFeedback.
     * @example
     * // Create one EpisodeFeedback
     * const EpisodeFeedback = await prisma.episodeFeedback.create({
     *   data: {
     *     // ... data to create a EpisodeFeedback
     *   }
     * })
     * 
     */
    create<T extends EpisodeFeedbackCreateArgs>(args: SelectSubset<T, EpisodeFeedbackCreateArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EpisodeFeedbacks.
     * @param {EpisodeFeedbackCreateManyArgs} args - Arguments to create many EpisodeFeedbacks.
     * @example
     * // Create many EpisodeFeedbacks
     * const episodeFeedback = await prisma.episodeFeedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EpisodeFeedbackCreateManyArgs>(args?: SelectSubset<T, EpisodeFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EpisodeFeedbacks and returns the data saved in the database.
     * @param {EpisodeFeedbackCreateManyAndReturnArgs} args - Arguments to create many EpisodeFeedbacks.
     * @example
     * // Create many EpisodeFeedbacks
     * const episodeFeedback = await prisma.episodeFeedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EpisodeFeedbacks and only return the `feedback_id`
     * const episodeFeedbackWithFeedback_idOnly = await prisma.episodeFeedback.createManyAndReturn({
     *   select: { feedback_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EpisodeFeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, EpisodeFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EpisodeFeedback.
     * @param {EpisodeFeedbackDeleteArgs} args - Arguments to delete one EpisodeFeedback.
     * @example
     * // Delete one EpisodeFeedback
     * const EpisodeFeedback = await prisma.episodeFeedback.delete({
     *   where: {
     *     // ... filter to delete one EpisodeFeedback
     *   }
     * })
     * 
     */
    delete<T extends EpisodeFeedbackDeleteArgs>(args: SelectSubset<T, EpisodeFeedbackDeleteArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EpisodeFeedback.
     * @param {EpisodeFeedbackUpdateArgs} args - Arguments to update one EpisodeFeedback.
     * @example
     * // Update one EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EpisodeFeedbackUpdateArgs>(args: SelectSubset<T, EpisodeFeedbackUpdateArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EpisodeFeedbacks.
     * @param {EpisodeFeedbackDeleteManyArgs} args - Arguments to filter EpisodeFeedbacks to delete.
     * @example
     * // Delete a few EpisodeFeedbacks
     * const { count } = await prisma.episodeFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EpisodeFeedbackDeleteManyArgs>(args?: SelectSubset<T, EpisodeFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EpisodeFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EpisodeFeedbacks
     * const episodeFeedback = await prisma.episodeFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EpisodeFeedbackUpdateManyArgs>(args: SelectSubset<T, EpisodeFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EpisodeFeedbacks and returns the data updated in the database.
     * @param {EpisodeFeedbackUpdateManyAndReturnArgs} args - Arguments to update many EpisodeFeedbacks.
     * @example
     * // Update many EpisodeFeedbacks
     * const episodeFeedback = await prisma.episodeFeedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EpisodeFeedbacks and only return the `feedback_id`
     * const episodeFeedbackWithFeedback_idOnly = await prisma.episodeFeedback.updateManyAndReturn({
     *   select: { feedback_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EpisodeFeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, EpisodeFeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EpisodeFeedback.
     * @param {EpisodeFeedbackUpsertArgs} args - Arguments to update or create a EpisodeFeedback.
     * @example
     * // Update or create a EpisodeFeedback
     * const episodeFeedback = await prisma.episodeFeedback.upsert({
     *   create: {
     *     // ... data to create a EpisodeFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EpisodeFeedback we want to update
     *   }
     * })
     */
    upsert<T extends EpisodeFeedbackUpsertArgs>(args: SelectSubset<T, EpisodeFeedbackUpsertArgs<ExtArgs>>): Prisma__EpisodeFeedbackClient<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EpisodeFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackCountArgs} args - Arguments to filter EpisodeFeedbacks to count.
     * @example
     * // Count the number of EpisodeFeedbacks
     * const count = await prisma.episodeFeedback.count({
     *   where: {
     *     // ... the filter for the EpisodeFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends EpisodeFeedbackCountArgs>(
      args?: Subset<T, EpisodeFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EpisodeFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EpisodeFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EpisodeFeedbackAggregateArgs>(args: Subset<T, EpisodeFeedbackAggregateArgs>): Prisma.PrismaPromise<GetEpisodeFeedbackAggregateType<T>>

    /**
     * Group by EpisodeFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EpisodeFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EpisodeFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: EpisodeFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EpisodeFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEpisodeFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EpisodeFeedback model
   */
  readonly fields: EpisodeFeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EpisodeFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EpisodeFeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    episode<T extends EpisodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EpisodeDefaultArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EpisodeFeedback model
   */
  interface EpisodeFeedbackFieldRefs {
    readonly feedback_id: FieldRef<"EpisodeFeedback", 'String'>
    readonly userId: FieldRef<"EpisodeFeedback", 'String'>
    readonly episodeId: FieldRef<"EpisodeFeedback", 'String'>
    readonly rating: FieldRef<"EpisodeFeedback", 'FeedbackRating'>
    readonly createdAt: FieldRef<"EpisodeFeedback", 'DateTime'>
    readonly updatedAt: FieldRef<"EpisodeFeedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EpisodeFeedback findUnique
   */
  export type EpisodeFeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which EpisodeFeedback to fetch.
     */
    where: EpisodeFeedbackWhereUniqueInput
  }

  /**
   * EpisodeFeedback findUniqueOrThrow
   */
  export type EpisodeFeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which EpisodeFeedback to fetch.
     */
    where: EpisodeFeedbackWhereUniqueInput
  }

  /**
   * EpisodeFeedback findFirst
   */
  export type EpisodeFeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which EpisodeFeedback to fetch.
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EpisodeFeedbacks to fetch.
     */
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EpisodeFeedbacks.
     */
    cursor?: EpisodeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EpisodeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EpisodeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EpisodeFeedbacks.
     */
    distinct?: EpisodeFeedbackScalarFieldEnum | EpisodeFeedbackScalarFieldEnum[]
  }

  /**
   * EpisodeFeedback findFirstOrThrow
   */
  export type EpisodeFeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which EpisodeFeedback to fetch.
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EpisodeFeedbacks to fetch.
     */
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EpisodeFeedbacks.
     */
    cursor?: EpisodeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EpisodeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EpisodeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EpisodeFeedbacks.
     */
    distinct?: EpisodeFeedbackScalarFieldEnum | EpisodeFeedbackScalarFieldEnum[]
  }

  /**
   * EpisodeFeedback findMany
   */
  export type EpisodeFeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which EpisodeFeedbacks to fetch.
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EpisodeFeedbacks to fetch.
     */
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EpisodeFeedbacks.
     */
    cursor?: EpisodeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EpisodeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EpisodeFeedbacks.
     */
    skip?: number
    distinct?: EpisodeFeedbackScalarFieldEnum | EpisodeFeedbackScalarFieldEnum[]
  }

  /**
   * EpisodeFeedback create
   */
  export type EpisodeFeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a EpisodeFeedback.
     */
    data: XOR<EpisodeFeedbackCreateInput, EpisodeFeedbackUncheckedCreateInput>
  }

  /**
   * EpisodeFeedback createMany
   */
  export type EpisodeFeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EpisodeFeedbacks.
     */
    data: EpisodeFeedbackCreateManyInput | EpisodeFeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EpisodeFeedback createManyAndReturn
   */
  export type EpisodeFeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many EpisodeFeedbacks.
     */
    data: EpisodeFeedbackCreateManyInput | EpisodeFeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EpisodeFeedback update
   */
  export type EpisodeFeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a EpisodeFeedback.
     */
    data: XOR<EpisodeFeedbackUpdateInput, EpisodeFeedbackUncheckedUpdateInput>
    /**
     * Choose, which EpisodeFeedback to update.
     */
    where: EpisodeFeedbackWhereUniqueInput
  }

  /**
   * EpisodeFeedback updateMany
   */
  export type EpisodeFeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EpisodeFeedbacks.
     */
    data: XOR<EpisodeFeedbackUpdateManyMutationInput, EpisodeFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which EpisodeFeedbacks to update
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * Limit how many EpisodeFeedbacks to update.
     */
    limit?: number
  }

  /**
   * EpisodeFeedback updateManyAndReturn
   */
  export type EpisodeFeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * The data used to update EpisodeFeedbacks.
     */
    data: XOR<EpisodeFeedbackUpdateManyMutationInput, EpisodeFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which EpisodeFeedbacks to update
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * Limit how many EpisodeFeedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EpisodeFeedback upsert
   */
  export type EpisodeFeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the EpisodeFeedback to update in case it exists.
     */
    where: EpisodeFeedbackWhereUniqueInput
    /**
     * In case the EpisodeFeedback found by the `where` argument doesn't exist, create a new EpisodeFeedback with this data.
     */
    create: XOR<EpisodeFeedbackCreateInput, EpisodeFeedbackUncheckedCreateInput>
    /**
     * In case the EpisodeFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EpisodeFeedbackUpdateInput, EpisodeFeedbackUncheckedUpdateInput>
  }

  /**
   * EpisodeFeedback delete
   */
  export type EpisodeFeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    /**
     * Filter which EpisodeFeedback to delete.
     */
    where: EpisodeFeedbackWhereUniqueInput
  }

  /**
   * EpisodeFeedback deleteMany
   */
  export type EpisodeFeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EpisodeFeedbacks to delete
     */
    where?: EpisodeFeedbackWhereInput
    /**
     * Limit how many EpisodeFeedbacks to delete.
     */
    limit?: number
  }

  /**
   * EpisodeFeedback without action
   */
  export type EpisodeFeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
  }


  /**
   * Model Bundle
   */

  export type AggregateBundle = {
    _count: BundleCountAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  export type BundleMinAggregateOutputType = {
    bundle_id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    is_static: boolean | null
    is_active: boolean | null
    owner_user_id: string | null
    created_at: Date | null
  }

  export type BundleMaxAggregateOutputType = {
    bundle_id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    is_static: boolean | null
    is_active: boolean | null
    owner_user_id: string | null
    created_at: Date | null
  }

  export type BundleCountAggregateOutputType = {
    bundle_id: number
    name: number
    description: number
    image_url: number
    is_static: number
    is_active: number
    owner_user_id: number
    created_at: number
    _all: number
  }


  export type BundleMinAggregateInputType = {
    bundle_id?: true
    name?: true
    description?: true
    image_url?: true
    is_static?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
  }

  export type BundleMaxAggregateInputType = {
    bundle_id?: true
    name?: true
    description?: true
    image_url?: true
    is_static?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
  }

  export type BundleCountAggregateInputType = {
    bundle_id?: true
    name?: true
    description?: true
    image_url?: true
    is_static?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
    _all?: true
  }

  export type BundleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bundle to aggregate.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bundles
    **/
    _count?: true | BundleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BundleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BundleMaxAggregateInputType
  }

  export type GetBundleAggregateType<T extends BundleAggregateArgs> = {
        [P in keyof T & keyof AggregateBundle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundle[P]>
      : GetScalarType<T[P], AggregateBundle[P]>
  }




  export type BundleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundleWhereInput
    orderBy?: BundleOrderByWithAggregationInput | BundleOrderByWithAggregationInput[]
    by: BundleScalarFieldEnum[] | BundleScalarFieldEnum
    having?: BundleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BundleCountAggregateInputType | true
    _min?: BundleMinAggregateInputType
    _max?: BundleMaxAggregateInputType
  }

  export type BundleGroupByOutputType = {
    bundle_id: string
    name: string
    description: string | null
    image_url: string | null
    is_static: boolean
    is_active: boolean
    owner_user_id: string | null
    created_at: Date
    _count: BundleCountAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  type GetBundleGroupByPayload<T extends BundleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BundleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BundleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BundleGroupByOutputType[P]>
            : GetScalarType<T[P], BundleGroupByOutputType[P]>
        }
      >
    >


  export type BundleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    user?: boolean | Bundle$userArgs<ExtArgs>
    bundle_podcast?: boolean | Bundle$bundle_podcastArgs<ExtArgs>
    episode?: boolean | Bundle$episodeArgs<ExtArgs>
    user_curation_profile?: boolean | Bundle$user_curation_profileArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type BundleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    user?: boolean | Bundle$userArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type BundleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    user?: boolean | Bundle$userArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type BundleSelectScalar = {
    bundle_id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
  }

  export type BundleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"bundle_id" | "name" | "description" | "image_url" | "is_static" | "is_active" | "owner_user_id" | "created_at", ExtArgs["result"]["bundle"]>
  export type BundleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Bundle$userArgs<ExtArgs>
    bundle_podcast?: boolean | Bundle$bundle_podcastArgs<ExtArgs>
    episode?: boolean | Bundle$episodeArgs<ExtArgs>
    user_curation_profile?: boolean | Bundle$user_curation_profileArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BundleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Bundle$userArgs<ExtArgs>
  }
  export type BundleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Bundle$userArgs<ExtArgs>
  }

  export type $BundlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bundle"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      bundle_podcast: Prisma.$BundlePodcastPayload<ExtArgs>[]
      episode: Prisma.$EpisodePayload<ExtArgs>[]
      user_curation_profile: Prisma.$UserCurationProfilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      bundle_id: string
      name: string
      description: string | null
      image_url: string | null
      is_static: boolean
      is_active: boolean
      owner_user_id: string | null
      created_at: Date
    }, ExtArgs["result"]["bundle"]>
    composites: {}
  }

  type BundleGetPayload<S extends boolean | null | undefined | BundleDefaultArgs> = $Result.GetResult<Prisma.$BundlePayload, S>

  type BundleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BundleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BundleCountAggregateInputType | true
    }

  export interface BundleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bundle'], meta: { name: 'Bundle' } }
    /**
     * Find zero or one Bundle that matches the filter.
     * @param {BundleFindUniqueArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BundleFindUniqueArgs>(args: SelectSubset<T, BundleFindUniqueArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bundle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BundleFindUniqueOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BundleFindUniqueOrThrowArgs>(args: SelectSubset<T, BundleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bundle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindFirstArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BundleFindFirstArgs>(args?: SelectSubset<T, BundleFindFirstArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bundle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindFirstOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BundleFindFirstOrThrowArgs>(args?: SelectSubset<T, BundleFindFirstOrThrowArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bundles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bundles
     * const bundles = await prisma.bundle.findMany()
     * 
     * // Get first 10 Bundles
     * const bundles = await prisma.bundle.findMany({ take: 10 })
     * 
     * // Only select the `bundle_id`
     * const bundleWithBundle_idOnly = await prisma.bundle.findMany({ select: { bundle_id: true } })
     * 
     */
    findMany<T extends BundleFindManyArgs>(args?: SelectSubset<T, BundleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bundle.
     * @param {BundleCreateArgs} args - Arguments to create a Bundle.
     * @example
     * // Create one Bundle
     * const Bundle = await prisma.bundle.create({
     *   data: {
     *     // ... data to create a Bundle
     *   }
     * })
     * 
     */
    create<T extends BundleCreateArgs>(args: SelectSubset<T, BundleCreateArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bundles.
     * @param {BundleCreateManyArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BundleCreateManyArgs>(args?: SelectSubset<T, BundleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bundles and returns the data saved in the database.
     * @param {BundleCreateManyAndReturnArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bundles and only return the `bundle_id`
     * const bundleWithBundle_idOnly = await prisma.bundle.createManyAndReturn({
     *   select: { bundle_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BundleCreateManyAndReturnArgs>(args?: SelectSubset<T, BundleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bundle.
     * @param {BundleDeleteArgs} args - Arguments to delete one Bundle.
     * @example
     * // Delete one Bundle
     * const Bundle = await prisma.bundle.delete({
     *   where: {
     *     // ... filter to delete one Bundle
     *   }
     * })
     * 
     */
    delete<T extends BundleDeleteArgs>(args: SelectSubset<T, BundleDeleteArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bundle.
     * @param {BundleUpdateArgs} args - Arguments to update one Bundle.
     * @example
     * // Update one Bundle
     * const bundle = await prisma.bundle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BundleUpdateArgs>(args: SelectSubset<T, BundleUpdateArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bundles.
     * @param {BundleDeleteManyArgs} args - Arguments to filter Bundles to delete.
     * @example
     * // Delete a few Bundles
     * const { count } = await prisma.bundle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BundleDeleteManyArgs>(args?: SelectSubset<T, BundleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bundles
     * const bundle = await prisma.bundle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BundleUpdateManyArgs>(args: SelectSubset<T, BundleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bundles and returns the data updated in the database.
     * @param {BundleUpdateManyAndReturnArgs} args - Arguments to update many Bundles.
     * @example
     * // Update many Bundles
     * const bundle = await prisma.bundle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bundles and only return the `bundle_id`
     * const bundleWithBundle_idOnly = await prisma.bundle.updateManyAndReturn({
     *   select: { bundle_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BundleUpdateManyAndReturnArgs>(args: SelectSubset<T, BundleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bundle.
     * @param {BundleUpsertArgs} args - Arguments to update or create a Bundle.
     * @example
     * // Update or create a Bundle
     * const bundle = await prisma.bundle.upsert({
     *   create: {
     *     // ... data to create a Bundle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bundle we want to update
     *   }
     * })
     */
    upsert<T extends BundleUpsertArgs>(args: SelectSubset<T, BundleUpsertArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleCountArgs} args - Arguments to filter Bundles to count.
     * @example
     * // Count the number of Bundles
     * const count = await prisma.bundle.count({
     *   where: {
     *     // ... the filter for the Bundles we want to count
     *   }
     * })
    **/
    count<T extends BundleCountArgs>(
      args?: Subset<T, BundleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BundleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BundleAggregateArgs>(args: Subset<T, BundleAggregateArgs>): Prisma.PrismaPromise<GetBundleAggregateType<T>>

    /**
     * Group by Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BundleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BundleGroupByArgs['orderBy'] }
        : { orderBy?: BundleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BundleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bundle model
   */
  readonly fields: BundleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bundle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BundleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Bundle$userArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bundle_podcast<T extends Bundle$bundle_podcastArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$bundle_podcastArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    episode<T extends Bundle$episodeArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$episodeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_curation_profile<T extends Bundle$user_curation_profileArgs<ExtArgs> = {}>(args?: Subset<T, Bundle$user_curation_profileArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bundle model
   */
  interface BundleFieldRefs {
    readonly bundle_id: FieldRef<"Bundle", 'String'>
    readonly name: FieldRef<"Bundle", 'String'>
    readonly description: FieldRef<"Bundle", 'String'>
    readonly image_url: FieldRef<"Bundle", 'String'>
    readonly is_static: FieldRef<"Bundle", 'Boolean'>
    readonly is_active: FieldRef<"Bundle", 'Boolean'>
    readonly owner_user_id: FieldRef<"Bundle", 'String'>
    readonly created_at: FieldRef<"Bundle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bundle findUnique
   */
  export type BundleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle findUniqueOrThrow
   */
  export type BundleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle findFirst
   */
  export type BundleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle findFirstOrThrow
   */
  export type BundleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundle to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle findMany
   */
  export type BundleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter, which Bundles to fetch.
     */
    where?: BundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bundles to fetch.
     */
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bundles.
     */
    cursor?: BundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bundles.
     */
    skip?: number
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * Bundle create
   */
  export type BundleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The data needed to create a Bundle.
     */
    data: XOR<BundleCreateInput, BundleUncheckedCreateInput>
  }

  /**
   * Bundle createMany
   */
  export type BundleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bundles.
     */
    data: BundleCreateManyInput | BundleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bundle createManyAndReturn
   */
  export type BundleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * The data used to create many Bundles.
     */
    data: BundleCreateManyInput | BundleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bundle update
   */
  export type BundleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The data needed to update a Bundle.
     */
    data: XOR<BundleUpdateInput, BundleUncheckedUpdateInput>
    /**
     * Choose, which Bundle to update.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle updateMany
   */
  export type BundleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bundles.
     */
    data: XOR<BundleUpdateManyMutationInput, BundleUncheckedUpdateManyInput>
    /**
     * Filter which Bundles to update
     */
    where?: BundleWhereInput
    /**
     * Limit how many Bundles to update.
     */
    limit?: number
  }

  /**
   * Bundle updateManyAndReturn
   */
  export type BundleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * The data used to update Bundles.
     */
    data: XOR<BundleUpdateManyMutationInput, BundleUncheckedUpdateManyInput>
    /**
     * Filter which Bundles to update
     */
    where?: BundleWhereInput
    /**
     * Limit how many Bundles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bundle upsert
   */
  export type BundleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * The filter to search for the Bundle to update in case it exists.
     */
    where: BundleWhereUniqueInput
    /**
     * In case the Bundle found by the `where` argument doesn't exist, create a new Bundle with this data.
     */
    create: XOR<BundleCreateInput, BundleUncheckedCreateInput>
    /**
     * In case the Bundle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BundleUpdateInput, BundleUncheckedUpdateInput>
  }

  /**
   * Bundle delete
   */
  export type BundleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    /**
     * Filter which Bundle to delete.
     */
    where: BundleWhereUniqueInput
  }

  /**
   * Bundle deleteMany
   */
  export type BundleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bundles to delete
     */
    where?: BundleWhereInput
    /**
     * Limit how many Bundles to delete.
     */
    limit?: number
  }

  /**
   * Bundle.user
   */
  export type Bundle$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Bundle.bundle_podcast
   */
  export type Bundle$bundle_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    where?: BundlePodcastWhereInput
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    cursor?: BundlePodcastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BundlePodcastScalarFieldEnum | BundlePodcastScalarFieldEnum[]
  }

  /**
   * Bundle.episode
   */
  export type Bundle$episodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    where?: EpisodeWhereInput
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    cursor?: EpisodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * Bundle.user_curation_profile
   */
  export type Bundle$user_curation_profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    where?: UserCurationProfileWhereInput
    orderBy?: UserCurationProfileOrderByWithRelationInput | UserCurationProfileOrderByWithRelationInput[]
    cursor?: UserCurationProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserCurationProfileScalarFieldEnum | UserCurationProfileScalarFieldEnum[]
  }

  /**
   * Bundle without action
   */
  export type BundleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
  }


  /**
   * Model BundlePodcast
   */

  export type AggregateBundlePodcast = {
    _count: BundlePodcastCountAggregateOutputType | null
    _min: BundlePodcastMinAggregateOutputType | null
    _max: BundlePodcastMaxAggregateOutputType | null
  }

  export type BundlePodcastMinAggregateOutputType = {
    bundle_id: string | null
    podcast_id: string | null
  }

  export type BundlePodcastMaxAggregateOutputType = {
    bundle_id: string | null
    podcast_id: string | null
  }

  export type BundlePodcastCountAggregateOutputType = {
    bundle_id: number
    podcast_id: number
    _all: number
  }


  export type BundlePodcastMinAggregateInputType = {
    bundle_id?: true
    podcast_id?: true
  }

  export type BundlePodcastMaxAggregateInputType = {
    bundle_id?: true
    podcast_id?: true
  }

  export type BundlePodcastCountAggregateInputType = {
    bundle_id?: true
    podcast_id?: true
    _all?: true
  }

  export type BundlePodcastAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BundlePodcast to aggregate.
     */
    where?: BundlePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundlePodcasts to fetch.
     */
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BundlePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundlePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundlePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BundlePodcasts
    **/
    _count?: true | BundlePodcastCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BundlePodcastMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BundlePodcastMaxAggregateInputType
  }

  export type GetBundlePodcastAggregateType<T extends BundlePodcastAggregateArgs> = {
        [P in keyof T & keyof AggregateBundlePodcast]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundlePodcast[P]>
      : GetScalarType<T[P], AggregateBundlePodcast[P]>
  }




  export type BundlePodcastGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BundlePodcastWhereInput
    orderBy?: BundlePodcastOrderByWithAggregationInput | BundlePodcastOrderByWithAggregationInput[]
    by: BundlePodcastScalarFieldEnum[] | BundlePodcastScalarFieldEnum
    having?: BundlePodcastScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BundlePodcastCountAggregateInputType | true
    _min?: BundlePodcastMinAggregateInputType
    _max?: BundlePodcastMaxAggregateInputType
  }

  export type BundlePodcastGroupByOutputType = {
    bundle_id: string
    podcast_id: string
    _count: BundlePodcastCountAggregateOutputType | null
    _min: BundlePodcastMinAggregateOutputType | null
    _max: BundlePodcastMaxAggregateOutputType | null
  }

  type GetBundlePodcastGroupByPayload<T extends BundlePodcastGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BundlePodcastGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BundlePodcastGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BundlePodcastGroupByOutputType[P]>
            : GetScalarType<T[P], BundlePodcastGroupByOutputType[P]>
        }
      >
    >


  export type BundlePodcastSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    podcast_id?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundlePodcast"]>

  export type BundlePodcastSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    podcast_id?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundlePodcast"]>

  export type BundlePodcastSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    bundle_id?: boolean
    podcast_id?: boolean
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundlePodcast"]>

  export type BundlePodcastSelectScalar = {
    bundle_id?: boolean
    podcast_id?: boolean
  }

  export type BundlePodcastOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"bundle_id" | "podcast_id", ExtArgs["result"]["bundlePodcast"]>
  export type BundlePodcastInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }
  export type BundlePodcastIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }
  export type BundlePodcastIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | BundleDefaultArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
  }

  export type $BundlePodcastPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BundlePodcast"
    objects: {
      bundle: Prisma.$BundlePayload<ExtArgs>
      podcast: Prisma.$PodcastPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      bundle_id: string
      podcast_id: string
    }, ExtArgs["result"]["bundlePodcast"]>
    composites: {}
  }

  type BundlePodcastGetPayload<S extends boolean | null | undefined | BundlePodcastDefaultArgs> = $Result.GetResult<Prisma.$BundlePodcastPayload, S>

  type BundlePodcastCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BundlePodcastFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BundlePodcastCountAggregateInputType | true
    }

  export interface BundlePodcastDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BundlePodcast'], meta: { name: 'BundlePodcast' } }
    /**
     * Find zero or one BundlePodcast that matches the filter.
     * @param {BundlePodcastFindUniqueArgs} args - Arguments to find a BundlePodcast
     * @example
     * // Get one BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BundlePodcastFindUniqueArgs>(args: SelectSubset<T, BundlePodcastFindUniqueArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BundlePodcast that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BundlePodcastFindUniqueOrThrowArgs} args - Arguments to find a BundlePodcast
     * @example
     * // Get one BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BundlePodcastFindUniqueOrThrowArgs>(args: SelectSubset<T, BundlePodcastFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BundlePodcast that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastFindFirstArgs} args - Arguments to find a BundlePodcast
     * @example
     * // Get one BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BundlePodcastFindFirstArgs>(args?: SelectSubset<T, BundlePodcastFindFirstArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BundlePodcast that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastFindFirstOrThrowArgs} args - Arguments to find a BundlePodcast
     * @example
     * // Get one BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BundlePodcastFindFirstOrThrowArgs>(args?: SelectSubset<T, BundlePodcastFindFirstOrThrowArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BundlePodcasts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BundlePodcasts
     * const bundlePodcasts = await prisma.bundlePodcast.findMany()
     * 
     * // Get first 10 BundlePodcasts
     * const bundlePodcasts = await prisma.bundlePodcast.findMany({ take: 10 })
     * 
     * // Only select the `bundle_id`
     * const bundlePodcastWithBundle_idOnly = await prisma.bundlePodcast.findMany({ select: { bundle_id: true } })
     * 
     */
    findMany<T extends BundlePodcastFindManyArgs>(args?: SelectSubset<T, BundlePodcastFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BundlePodcast.
     * @param {BundlePodcastCreateArgs} args - Arguments to create a BundlePodcast.
     * @example
     * // Create one BundlePodcast
     * const BundlePodcast = await prisma.bundlePodcast.create({
     *   data: {
     *     // ... data to create a BundlePodcast
     *   }
     * })
     * 
     */
    create<T extends BundlePodcastCreateArgs>(args: SelectSubset<T, BundlePodcastCreateArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BundlePodcasts.
     * @param {BundlePodcastCreateManyArgs} args - Arguments to create many BundlePodcasts.
     * @example
     * // Create many BundlePodcasts
     * const bundlePodcast = await prisma.bundlePodcast.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BundlePodcastCreateManyArgs>(args?: SelectSubset<T, BundlePodcastCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BundlePodcasts and returns the data saved in the database.
     * @param {BundlePodcastCreateManyAndReturnArgs} args - Arguments to create many BundlePodcasts.
     * @example
     * // Create many BundlePodcasts
     * const bundlePodcast = await prisma.bundlePodcast.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BundlePodcasts and only return the `bundle_id`
     * const bundlePodcastWithBundle_idOnly = await prisma.bundlePodcast.createManyAndReturn({
     *   select: { bundle_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BundlePodcastCreateManyAndReturnArgs>(args?: SelectSubset<T, BundlePodcastCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BundlePodcast.
     * @param {BundlePodcastDeleteArgs} args - Arguments to delete one BundlePodcast.
     * @example
     * // Delete one BundlePodcast
     * const BundlePodcast = await prisma.bundlePodcast.delete({
     *   where: {
     *     // ... filter to delete one BundlePodcast
     *   }
     * })
     * 
     */
    delete<T extends BundlePodcastDeleteArgs>(args: SelectSubset<T, BundlePodcastDeleteArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BundlePodcast.
     * @param {BundlePodcastUpdateArgs} args - Arguments to update one BundlePodcast.
     * @example
     * // Update one BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BundlePodcastUpdateArgs>(args: SelectSubset<T, BundlePodcastUpdateArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BundlePodcasts.
     * @param {BundlePodcastDeleteManyArgs} args - Arguments to filter BundlePodcasts to delete.
     * @example
     * // Delete a few BundlePodcasts
     * const { count } = await prisma.bundlePodcast.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BundlePodcastDeleteManyArgs>(args?: SelectSubset<T, BundlePodcastDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BundlePodcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BundlePodcasts
     * const bundlePodcast = await prisma.bundlePodcast.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BundlePodcastUpdateManyArgs>(args: SelectSubset<T, BundlePodcastUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BundlePodcasts and returns the data updated in the database.
     * @param {BundlePodcastUpdateManyAndReturnArgs} args - Arguments to update many BundlePodcasts.
     * @example
     * // Update many BundlePodcasts
     * const bundlePodcast = await prisma.bundlePodcast.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BundlePodcasts and only return the `bundle_id`
     * const bundlePodcastWithBundle_idOnly = await prisma.bundlePodcast.updateManyAndReturn({
     *   select: { bundle_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BundlePodcastUpdateManyAndReturnArgs>(args: SelectSubset<T, BundlePodcastUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BundlePodcast.
     * @param {BundlePodcastUpsertArgs} args - Arguments to update or create a BundlePodcast.
     * @example
     * // Update or create a BundlePodcast
     * const bundlePodcast = await prisma.bundlePodcast.upsert({
     *   create: {
     *     // ... data to create a BundlePodcast
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BundlePodcast we want to update
     *   }
     * })
     */
    upsert<T extends BundlePodcastUpsertArgs>(args: SelectSubset<T, BundlePodcastUpsertArgs<ExtArgs>>): Prisma__BundlePodcastClient<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BundlePodcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastCountArgs} args - Arguments to filter BundlePodcasts to count.
     * @example
     * // Count the number of BundlePodcasts
     * const count = await prisma.bundlePodcast.count({
     *   where: {
     *     // ... the filter for the BundlePodcasts we want to count
     *   }
     * })
    **/
    count<T extends BundlePodcastCountArgs>(
      args?: Subset<T, BundlePodcastCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BundlePodcastCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BundlePodcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BundlePodcastAggregateArgs>(args: Subset<T, BundlePodcastAggregateArgs>): Prisma.PrismaPromise<GetBundlePodcastAggregateType<T>>

    /**
     * Group by BundlePodcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundlePodcastGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BundlePodcastGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BundlePodcastGroupByArgs['orderBy'] }
        : { orderBy?: BundlePodcastGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BundlePodcastGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundlePodcastGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BundlePodcast model
   */
  readonly fields: BundlePodcastFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BundlePodcast.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BundlePodcastClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends BundleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BundleDefaultArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    podcast<T extends PodcastDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PodcastDefaultArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BundlePodcast model
   */
  interface BundlePodcastFieldRefs {
    readonly bundle_id: FieldRef<"BundlePodcast", 'String'>
    readonly podcast_id: FieldRef<"BundlePodcast", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BundlePodcast findUnique
   */
  export type BundlePodcastFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter, which BundlePodcast to fetch.
     */
    where: BundlePodcastWhereUniqueInput
  }

  /**
   * BundlePodcast findUniqueOrThrow
   */
  export type BundlePodcastFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter, which BundlePodcast to fetch.
     */
    where: BundlePodcastWhereUniqueInput
  }

  /**
   * BundlePodcast findFirst
   */
  export type BundlePodcastFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter, which BundlePodcast to fetch.
     */
    where?: BundlePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundlePodcasts to fetch.
     */
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BundlePodcasts.
     */
    cursor?: BundlePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundlePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundlePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BundlePodcasts.
     */
    distinct?: BundlePodcastScalarFieldEnum | BundlePodcastScalarFieldEnum[]
  }

  /**
   * BundlePodcast findFirstOrThrow
   */
  export type BundlePodcastFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter, which BundlePodcast to fetch.
     */
    where?: BundlePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundlePodcasts to fetch.
     */
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BundlePodcasts.
     */
    cursor?: BundlePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundlePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundlePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BundlePodcasts.
     */
    distinct?: BundlePodcastScalarFieldEnum | BundlePodcastScalarFieldEnum[]
  }

  /**
   * BundlePodcast findMany
   */
  export type BundlePodcastFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter, which BundlePodcasts to fetch.
     */
    where?: BundlePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BundlePodcasts to fetch.
     */
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BundlePodcasts.
     */
    cursor?: BundlePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BundlePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BundlePodcasts.
     */
    skip?: number
    distinct?: BundlePodcastScalarFieldEnum | BundlePodcastScalarFieldEnum[]
  }

  /**
   * BundlePodcast create
   */
  export type BundlePodcastCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * The data needed to create a BundlePodcast.
     */
    data: XOR<BundlePodcastCreateInput, BundlePodcastUncheckedCreateInput>
  }

  /**
   * BundlePodcast createMany
   */
  export type BundlePodcastCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BundlePodcasts.
     */
    data: BundlePodcastCreateManyInput | BundlePodcastCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BundlePodcast createManyAndReturn
   */
  export type BundlePodcastCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * The data used to create many BundlePodcasts.
     */
    data: BundlePodcastCreateManyInput | BundlePodcastCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BundlePodcast update
   */
  export type BundlePodcastUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * The data needed to update a BundlePodcast.
     */
    data: XOR<BundlePodcastUpdateInput, BundlePodcastUncheckedUpdateInput>
    /**
     * Choose, which BundlePodcast to update.
     */
    where: BundlePodcastWhereUniqueInput
  }

  /**
   * BundlePodcast updateMany
   */
  export type BundlePodcastUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BundlePodcasts.
     */
    data: XOR<BundlePodcastUpdateManyMutationInput, BundlePodcastUncheckedUpdateManyInput>
    /**
     * Filter which BundlePodcasts to update
     */
    where?: BundlePodcastWhereInput
    /**
     * Limit how many BundlePodcasts to update.
     */
    limit?: number
  }

  /**
   * BundlePodcast updateManyAndReturn
   */
  export type BundlePodcastUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * The data used to update BundlePodcasts.
     */
    data: XOR<BundlePodcastUpdateManyMutationInput, BundlePodcastUncheckedUpdateManyInput>
    /**
     * Filter which BundlePodcasts to update
     */
    where?: BundlePodcastWhereInput
    /**
     * Limit how many BundlePodcasts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BundlePodcast upsert
   */
  export type BundlePodcastUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * The filter to search for the BundlePodcast to update in case it exists.
     */
    where: BundlePodcastWhereUniqueInput
    /**
     * In case the BundlePodcast found by the `where` argument doesn't exist, create a new BundlePodcast with this data.
     */
    create: XOR<BundlePodcastCreateInput, BundlePodcastUncheckedCreateInput>
    /**
     * In case the BundlePodcast was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BundlePodcastUpdateInput, BundlePodcastUncheckedUpdateInput>
  }

  /**
   * BundlePodcast delete
   */
  export type BundlePodcastDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    /**
     * Filter which BundlePodcast to delete.
     */
    where: BundlePodcastWhereUniqueInput
  }

  /**
   * BundlePodcast deleteMany
   */
  export type BundlePodcastDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BundlePodcasts to delete
     */
    where?: BundlePodcastWhereInput
    /**
     * Limit how many BundlePodcasts to delete.
     */
    limit?: number
  }

  /**
   * BundlePodcast without action
   */
  export type BundlePodcastDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
  }


  /**
   * Model Episode
   */

  export type AggregateEpisode = {
    _count: EpisodeCountAggregateOutputType | null
    _min: EpisodeMinAggregateOutputType | null
    _max: EpisodeMaxAggregateOutputType | null
  }

  export type EpisodeMinAggregateOutputType = {
    episode_id: string | null
    podcast_id: string | null
    profile_id: string | null
    bundle_id: string | null
    title: string | null
    description: string | null
    audio_url: string | null
    image_url: string | null
    published_at: Date | null
    week_nr: Date | null
    created_at: Date | null
  }

  export type EpisodeMaxAggregateOutputType = {
    episode_id: string | null
    podcast_id: string | null
    profile_id: string | null
    bundle_id: string | null
    title: string | null
    description: string | null
    audio_url: string | null
    image_url: string | null
    published_at: Date | null
    week_nr: Date | null
    created_at: Date | null
  }

  export type EpisodeCountAggregateOutputType = {
    episode_id: number
    podcast_id: number
    profile_id: number
    bundle_id: number
    title: number
    description: number
    audio_url: number
    image_url: number
    published_at: number
    week_nr: number
    created_at: number
    _all: number
  }


  export type EpisodeMinAggregateInputType = {
    episode_id?: true
    podcast_id?: true
    profile_id?: true
    bundle_id?: true
    title?: true
    description?: true
    audio_url?: true
    image_url?: true
    published_at?: true
    week_nr?: true
    created_at?: true
  }

  export type EpisodeMaxAggregateInputType = {
    episode_id?: true
    podcast_id?: true
    profile_id?: true
    bundle_id?: true
    title?: true
    description?: true
    audio_url?: true
    image_url?: true
    published_at?: true
    week_nr?: true
    created_at?: true
  }

  export type EpisodeCountAggregateInputType = {
    episode_id?: true
    podcast_id?: true
    profile_id?: true
    bundle_id?: true
    title?: true
    description?: true
    audio_url?: true
    image_url?: true
    published_at?: true
    week_nr?: true
    created_at?: true
    _all?: true
  }

  export type EpisodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Episode to aggregate.
     */
    where?: EpisodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Episodes to fetch.
     */
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EpisodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Episodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Episodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Episodes
    **/
    _count?: true | EpisodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EpisodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EpisodeMaxAggregateInputType
  }

  export type GetEpisodeAggregateType<T extends EpisodeAggregateArgs> = {
        [P in keyof T & keyof AggregateEpisode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEpisode[P]>
      : GetScalarType<T[P], AggregateEpisode[P]>
  }




  export type EpisodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EpisodeWhereInput
    orderBy?: EpisodeOrderByWithAggregationInput | EpisodeOrderByWithAggregationInput[]
    by: EpisodeScalarFieldEnum[] | EpisodeScalarFieldEnum
    having?: EpisodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EpisodeCountAggregateInputType | true
    _min?: EpisodeMinAggregateInputType
    _max?: EpisodeMaxAggregateInputType
  }

  export type EpisodeGroupByOutputType = {
    episode_id: string
    podcast_id: string
    profile_id: string | null
    bundle_id: string | null
    title: string
    description: string | null
    audio_url: string
    image_url: string | null
    published_at: Date | null
    week_nr: Date | null
    created_at: Date
    _count: EpisodeCountAggregateOutputType | null
    _min: EpisodeMinAggregateOutputType | null
    _max: EpisodeMaxAggregateOutputType | null
  }

  type GetEpisodeGroupByPayload<T extends EpisodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EpisodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EpisodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EpisodeGroupByOutputType[P]>
            : GetScalarType<T[P], EpisodeGroupByOutputType[P]>
        }
      >
    >


  export type EpisodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    episode_id?: boolean
    podcast_id?: boolean
    profile_id?: boolean
    bundle_id?: boolean
    title?: boolean
    description?: boolean
    audio_url?: boolean
    image_url?: boolean
    published_at?: boolean
    week_nr?: boolean
    created_at?: boolean
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
    feedback?: boolean | Episode$feedbackArgs<ExtArgs>
    _count?: boolean | EpisodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["episode"]>

  export type EpisodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    episode_id?: boolean
    podcast_id?: boolean
    profile_id?: boolean
    bundle_id?: boolean
    title?: boolean
    description?: boolean
    audio_url?: boolean
    image_url?: boolean
    published_at?: boolean
    week_nr?: boolean
    created_at?: boolean
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
  }, ExtArgs["result"]["episode"]>

  export type EpisodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    episode_id?: boolean
    podcast_id?: boolean
    profile_id?: boolean
    bundle_id?: boolean
    title?: boolean
    description?: boolean
    audio_url?: boolean
    image_url?: boolean
    published_at?: boolean
    week_nr?: boolean
    created_at?: boolean
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
  }, ExtArgs["result"]["episode"]>

  export type EpisodeSelectScalar = {
    episode_id?: boolean
    podcast_id?: boolean
    profile_id?: boolean
    bundle_id?: boolean
    title?: boolean
    description?: boolean
    audio_url?: boolean
    image_url?: boolean
    published_at?: boolean
    week_nr?: boolean
    created_at?: boolean
  }

  export type EpisodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"episode_id" | "podcast_id" | "profile_id" | "bundle_id" | "title" | "description" | "audio_url" | "image_url" | "published_at" | "week_nr" | "created_at", ExtArgs["result"]["episode"]>
  export type EpisodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
    feedback?: boolean | Episode$feedbackArgs<ExtArgs>
    _count?: boolean | EpisodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EpisodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
  }
  export type EpisodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | Episode$bundleArgs<ExtArgs>
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | Episode$user_curation_profileArgs<ExtArgs>
  }

  export type $EpisodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Episode"
    objects: {
      bundle: Prisma.$BundlePayload<ExtArgs> | null
      podcast: Prisma.$PodcastPayload<ExtArgs>
      user_curation_profile: Prisma.$UserCurationProfilePayload<ExtArgs> | null
      feedback: Prisma.$EpisodeFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      episode_id: string
      podcast_id: string
      profile_id: string | null
      bundle_id: string | null
      title: string
      description: string | null
      audio_url: string
      image_url: string | null
      published_at: Date | null
      week_nr: Date | null
      created_at: Date
    }, ExtArgs["result"]["episode"]>
    composites: {}
  }

  type EpisodeGetPayload<S extends boolean | null | undefined | EpisodeDefaultArgs> = $Result.GetResult<Prisma.$EpisodePayload, S>

  type EpisodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EpisodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EpisodeCountAggregateInputType | true
    }

  export interface EpisodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Episode'], meta: { name: 'Episode' } }
    /**
     * Find zero or one Episode that matches the filter.
     * @param {EpisodeFindUniqueArgs} args - Arguments to find a Episode
     * @example
     * // Get one Episode
     * const episode = await prisma.episode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EpisodeFindUniqueArgs>(args: SelectSubset<T, EpisodeFindUniqueArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Episode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EpisodeFindUniqueOrThrowArgs} args - Arguments to find a Episode
     * @example
     * // Get one Episode
     * const episode = await prisma.episode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EpisodeFindUniqueOrThrowArgs>(args: SelectSubset<T, EpisodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Episode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFindFirstArgs} args - Arguments to find a Episode
     * @example
     * // Get one Episode
     * const episode = await prisma.episode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EpisodeFindFirstArgs>(args?: SelectSubset<T, EpisodeFindFirstArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Episode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFindFirstOrThrowArgs} args - Arguments to find a Episode
     * @example
     * // Get one Episode
     * const episode = await prisma.episode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EpisodeFindFirstOrThrowArgs>(args?: SelectSubset<T, EpisodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Episodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Episodes
     * const episodes = await prisma.episode.findMany()
     * 
     * // Get first 10 Episodes
     * const episodes = await prisma.episode.findMany({ take: 10 })
     * 
     * // Only select the `episode_id`
     * const episodeWithEpisode_idOnly = await prisma.episode.findMany({ select: { episode_id: true } })
     * 
     */
    findMany<T extends EpisodeFindManyArgs>(args?: SelectSubset<T, EpisodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Episode.
     * @param {EpisodeCreateArgs} args - Arguments to create a Episode.
     * @example
     * // Create one Episode
     * const Episode = await prisma.episode.create({
     *   data: {
     *     // ... data to create a Episode
     *   }
     * })
     * 
     */
    create<T extends EpisodeCreateArgs>(args: SelectSubset<T, EpisodeCreateArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Episodes.
     * @param {EpisodeCreateManyArgs} args - Arguments to create many Episodes.
     * @example
     * // Create many Episodes
     * const episode = await prisma.episode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EpisodeCreateManyArgs>(args?: SelectSubset<T, EpisodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Episodes and returns the data saved in the database.
     * @param {EpisodeCreateManyAndReturnArgs} args - Arguments to create many Episodes.
     * @example
     * // Create many Episodes
     * const episode = await prisma.episode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Episodes and only return the `episode_id`
     * const episodeWithEpisode_idOnly = await prisma.episode.createManyAndReturn({
     *   select: { episode_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EpisodeCreateManyAndReturnArgs>(args?: SelectSubset<T, EpisodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Episode.
     * @param {EpisodeDeleteArgs} args - Arguments to delete one Episode.
     * @example
     * // Delete one Episode
     * const Episode = await prisma.episode.delete({
     *   where: {
     *     // ... filter to delete one Episode
     *   }
     * })
     * 
     */
    delete<T extends EpisodeDeleteArgs>(args: SelectSubset<T, EpisodeDeleteArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Episode.
     * @param {EpisodeUpdateArgs} args - Arguments to update one Episode.
     * @example
     * // Update one Episode
     * const episode = await prisma.episode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EpisodeUpdateArgs>(args: SelectSubset<T, EpisodeUpdateArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Episodes.
     * @param {EpisodeDeleteManyArgs} args - Arguments to filter Episodes to delete.
     * @example
     * // Delete a few Episodes
     * const { count } = await prisma.episode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EpisodeDeleteManyArgs>(args?: SelectSubset<T, EpisodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Episodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Episodes
     * const episode = await prisma.episode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EpisodeUpdateManyArgs>(args: SelectSubset<T, EpisodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Episodes and returns the data updated in the database.
     * @param {EpisodeUpdateManyAndReturnArgs} args - Arguments to update many Episodes.
     * @example
     * // Update many Episodes
     * const episode = await prisma.episode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Episodes and only return the `episode_id`
     * const episodeWithEpisode_idOnly = await prisma.episode.updateManyAndReturn({
     *   select: { episode_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EpisodeUpdateManyAndReturnArgs>(args: SelectSubset<T, EpisodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Episode.
     * @param {EpisodeUpsertArgs} args - Arguments to update or create a Episode.
     * @example
     * // Update or create a Episode
     * const episode = await prisma.episode.upsert({
     *   create: {
     *     // ... data to create a Episode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Episode we want to update
     *   }
     * })
     */
    upsert<T extends EpisodeUpsertArgs>(args: SelectSubset<T, EpisodeUpsertArgs<ExtArgs>>): Prisma__EpisodeClient<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Episodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeCountArgs} args - Arguments to filter Episodes to count.
     * @example
     * // Count the number of Episodes
     * const count = await prisma.episode.count({
     *   where: {
     *     // ... the filter for the Episodes we want to count
     *   }
     * })
    **/
    count<T extends EpisodeCountArgs>(
      args?: Subset<T, EpisodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EpisodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Episode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EpisodeAggregateArgs>(args: Subset<T, EpisodeAggregateArgs>): Prisma.PrismaPromise<GetEpisodeAggregateType<T>>

    /**
     * Group by Episode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EpisodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EpisodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EpisodeGroupByArgs['orderBy'] }
        : { orderBy?: EpisodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EpisodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEpisodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Episode model
   */
  readonly fields: EpisodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Episode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EpisodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends Episode$bundleArgs<ExtArgs> = {}>(args?: Subset<T, Episode$bundleArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    podcast<T extends PodcastDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PodcastDefaultArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user_curation_profile<T extends Episode$user_curation_profileArgs<ExtArgs> = {}>(args?: Subset<T, Episode$user_curation_profileArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    feedback<T extends Episode$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, Episode$feedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Episode model
   */
  interface EpisodeFieldRefs {
    readonly episode_id: FieldRef<"Episode", 'String'>
    readonly podcast_id: FieldRef<"Episode", 'String'>
    readonly profile_id: FieldRef<"Episode", 'String'>
    readonly bundle_id: FieldRef<"Episode", 'String'>
    readonly title: FieldRef<"Episode", 'String'>
    readonly description: FieldRef<"Episode", 'String'>
    readonly audio_url: FieldRef<"Episode", 'String'>
    readonly image_url: FieldRef<"Episode", 'String'>
    readonly published_at: FieldRef<"Episode", 'DateTime'>
    readonly week_nr: FieldRef<"Episode", 'DateTime'>
    readonly created_at: FieldRef<"Episode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Episode findUnique
   */
  export type EpisodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter, which Episode to fetch.
     */
    where: EpisodeWhereUniqueInput
  }

  /**
   * Episode findUniqueOrThrow
   */
  export type EpisodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter, which Episode to fetch.
     */
    where: EpisodeWhereUniqueInput
  }

  /**
   * Episode findFirst
   */
  export type EpisodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter, which Episode to fetch.
     */
    where?: EpisodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Episodes to fetch.
     */
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Episodes.
     */
    cursor?: EpisodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Episodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Episodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Episodes.
     */
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * Episode findFirstOrThrow
   */
  export type EpisodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter, which Episode to fetch.
     */
    where?: EpisodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Episodes to fetch.
     */
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Episodes.
     */
    cursor?: EpisodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Episodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Episodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Episodes.
     */
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * Episode findMany
   */
  export type EpisodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter, which Episodes to fetch.
     */
    where?: EpisodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Episodes to fetch.
     */
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Episodes.
     */
    cursor?: EpisodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Episodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Episodes.
     */
    skip?: number
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * Episode create
   */
  export type EpisodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * The data needed to create a Episode.
     */
    data: XOR<EpisodeCreateInput, EpisodeUncheckedCreateInput>
  }

  /**
   * Episode createMany
   */
  export type EpisodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Episodes.
     */
    data: EpisodeCreateManyInput | EpisodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Episode createManyAndReturn
   */
  export type EpisodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * The data used to create many Episodes.
     */
    data: EpisodeCreateManyInput | EpisodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Episode update
   */
  export type EpisodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * The data needed to update a Episode.
     */
    data: XOR<EpisodeUpdateInput, EpisodeUncheckedUpdateInput>
    /**
     * Choose, which Episode to update.
     */
    where: EpisodeWhereUniqueInput
  }

  /**
   * Episode updateMany
   */
  export type EpisodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Episodes.
     */
    data: XOR<EpisodeUpdateManyMutationInput, EpisodeUncheckedUpdateManyInput>
    /**
     * Filter which Episodes to update
     */
    where?: EpisodeWhereInput
    /**
     * Limit how many Episodes to update.
     */
    limit?: number
  }

  /**
   * Episode updateManyAndReturn
   */
  export type EpisodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * The data used to update Episodes.
     */
    data: XOR<EpisodeUpdateManyMutationInput, EpisodeUncheckedUpdateManyInput>
    /**
     * Filter which Episodes to update
     */
    where?: EpisodeWhereInput
    /**
     * Limit how many Episodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Episode upsert
   */
  export type EpisodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * The filter to search for the Episode to update in case it exists.
     */
    where: EpisodeWhereUniqueInput
    /**
     * In case the Episode found by the `where` argument doesn't exist, create a new Episode with this data.
     */
    create: XOR<EpisodeCreateInput, EpisodeUncheckedCreateInput>
    /**
     * In case the Episode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EpisodeUpdateInput, EpisodeUncheckedUpdateInput>
  }

  /**
   * Episode delete
   */
  export type EpisodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    /**
     * Filter which Episode to delete.
     */
    where: EpisodeWhereUniqueInput
  }

  /**
   * Episode deleteMany
   */
  export type EpisodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Episodes to delete
     */
    where?: EpisodeWhereInput
    /**
     * Limit how many Episodes to delete.
     */
    limit?: number
  }

  /**
   * Episode.bundle
   */
  export type Episode$bundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    where?: BundleWhereInput
  }

  /**
   * Episode.user_curation_profile
   */
  export type Episode$user_curation_profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    where?: UserCurationProfileWhereInput
  }

  /**
   * Episode.feedback
   */
  export type Episode$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    where?: EpisodeFeedbackWhereInput
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    cursor?: EpisodeFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EpisodeFeedbackScalarFieldEnum | EpisodeFeedbackScalarFieldEnum[]
  }

  /**
   * Episode without action
   */
  export type EpisodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    notification_id: string | null
    user_id: string | null
    type: string | null
    message: string | null
    is_read: boolean | null
    created_at: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    notification_id: string | null
    user_id: string | null
    type: string | null
    message: string | null
    is_read: boolean | null
    created_at: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    notification_id: number
    user_id: number
    type: number
    message: number
    is_read: number
    created_at: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    notification_id?: true
    user_id?: true
    type?: true
    message?: true
    is_read?: true
    created_at?: true
  }

  export type NotificationMaxAggregateInputType = {
    notification_id?: true
    user_id?: true
    type?: true
    message?: true
    is_read?: true
    created_at?: true
  }

  export type NotificationCountAggregateInputType = {
    notification_id?: true
    user_id?: true
    type?: true
    message?: true
    is_read?: true
    created_at?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    notification_id: string
    user_id: string
    type: string
    message: string
    is_read: boolean
    created_at: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    type?: boolean
    message?: boolean
    is_read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    type?: boolean
    message?: boolean
    is_read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    type?: boolean
    message?: boolean
    is_read?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    notification_id?: boolean
    user_id?: boolean
    type?: boolean
    message?: boolean
    is_read?: boolean
    created_at?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"notification_id" | "user_id" | "type" | "message" | "is_read" | "created_at", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      notification_id: string
      user_id: string
      type: string
      message: string
      is_read: boolean
      created_at: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.findMany({ select: { notification_id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.createManyAndReturn({
     *   select: { notification_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.updateManyAndReturn({
     *   select: { notification_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly notification_id: FieldRef<"Notification", 'String'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly is_read: FieldRef<"Notification", 'Boolean'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model Podcast
   */

  export type AggregatePodcast = {
    _count: PodcastCountAggregateOutputType | null
    _min: PodcastMinAggregateOutputType | null
    _max: PodcastMaxAggregateOutputType | null
  }

  export type PodcastMinAggregateOutputType = {
    podcast_id: string | null
    name: string | null
    description: string | null
    url: string | null
    image_url: string | null
    category: string | null
    is_active: boolean | null
    owner_user_id: string | null
    created_at: Date | null
  }

  export type PodcastMaxAggregateOutputType = {
    podcast_id: string | null
    name: string | null
    description: string | null
    url: string | null
    image_url: string | null
    category: string | null
    is_active: boolean | null
    owner_user_id: string | null
    created_at: Date | null
  }

  export type PodcastCountAggregateOutputType = {
    podcast_id: number
    name: number
    description: number
    url: number
    image_url: number
    category: number
    is_active: number
    owner_user_id: number
    created_at: number
    _all: number
  }


  export type PodcastMinAggregateInputType = {
    podcast_id?: true
    name?: true
    description?: true
    url?: true
    image_url?: true
    category?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
  }

  export type PodcastMaxAggregateInputType = {
    podcast_id?: true
    name?: true
    description?: true
    url?: true
    image_url?: true
    category?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
  }

  export type PodcastCountAggregateInputType = {
    podcast_id?: true
    name?: true
    description?: true
    url?: true
    image_url?: true
    category?: true
    is_active?: true
    owner_user_id?: true
    created_at?: true
    _all?: true
  }

  export type PodcastAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Podcast to aggregate.
     */
    where?: PodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Podcasts to fetch.
     */
    orderBy?: PodcastOrderByWithRelationInput | PodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Podcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Podcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Podcasts
    **/
    _count?: true | PodcastCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PodcastMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PodcastMaxAggregateInputType
  }

  export type GetPodcastAggregateType<T extends PodcastAggregateArgs> = {
        [P in keyof T & keyof AggregatePodcast]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePodcast[P]>
      : GetScalarType<T[P], AggregatePodcast[P]>
  }




  export type PodcastGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PodcastWhereInput
    orderBy?: PodcastOrderByWithAggregationInput | PodcastOrderByWithAggregationInput[]
    by: PodcastScalarFieldEnum[] | PodcastScalarFieldEnum
    having?: PodcastScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PodcastCountAggregateInputType | true
    _min?: PodcastMinAggregateInputType
    _max?: PodcastMaxAggregateInputType
  }

  export type PodcastGroupByOutputType = {
    podcast_id: string
    name: string
    description: string | null
    url: string
    image_url: string | null
    category: string | null
    is_active: boolean
    owner_user_id: string | null
    created_at: Date
    _count: PodcastCountAggregateOutputType | null
    _min: PodcastMinAggregateOutputType | null
    _max: PodcastMaxAggregateOutputType | null
  }

  type GetPodcastGroupByPayload<T extends PodcastGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PodcastGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PodcastGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PodcastGroupByOutputType[P]>
            : GetScalarType<T[P], PodcastGroupByOutputType[P]>
        }
      >
    >


  export type PodcastSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    podcast_id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    image_url?: boolean
    category?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    bundle_podcast?: boolean | Podcast$bundle_podcastArgs<ExtArgs>
    episode?: boolean | Podcast$episodeArgs<ExtArgs>
    user?: boolean | Podcast$userArgs<ExtArgs>
    profile_podcast?: boolean | Podcast$profile_podcastArgs<ExtArgs>
    _count?: boolean | PodcastCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["podcast"]>

  export type PodcastSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    podcast_id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    image_url?: boolean
    category?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    user?: boolean | Podcast$userArgs<ExtArgs>
  }, ExtArgs["result"]["podcast"]>

  export type PodcastSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    podcast_id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    image_url?: boolean
    category?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
    user?: boolean | Podcast$userArgs<ExtArgs>
  }, ExtArgs["result"]["podcast"]>

  export type PodcastSelectScalar = {
    podcast_id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    image_url?: boolean
    category?: boolean
    is_active?: boolean
    owner_user_id?: boolean
    created_at?: boolean
  }

  export type PodcastOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"podcast_id" | "name" | "description" | "url" | "image_url" | "category" | "is_active" | "owner_user_id" | "created_at", ExtArgs["result"]["podcast"]>
  export type PodcastInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle_podcast?: boolean | Podcast$bundle_podcastArgs<ExtArgs>
    episode?: boolean | Podcast$episodeArgs<ExtArgs>
    user?: boolean | Podcast$userArgs<ExtArgs>
    profile_podcast?: boolean | Podcast$profile_podcastArgs<ExtArgs>
    _count?: boolean | PodcastCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PodcastIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Podcast$userArgs<ExtArgs>
  }
  export type PodcastIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Podcast$userArgs<ExtArgs>
  }

  export type $PodcastPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Podcast"
    objects: {
      bundle_podcast: Prisma.$BundlePodcastPayload<ExtArgs>[]
      episode: Prisma.$EpisodePayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs> | null
      profile_podcast: Prisma.$ProfilePodcastPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      podcast_id: string
      name: string
      description: string | null
      url: string
      image_url: string | null
      category: string | null
      is_active: boolean
      owner_user_id: string | null
      created_at: Date
    }, ExtArgs["result"]["podcast"]>
    composites: {}
  }

  type PodcastGetPayload<S extends boolean | null | undefined | PodcastDefaultArgs> = $Result.GetResult<Prisma.$PodcastPayload, S>

  type PodcastCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PodcastFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PodcastCountAggregateInputType | true
    }

  export interface PodcastDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Podcast'], meta: { name: 'Podcast' } }
    /**
     * Find zero or one Podcast that matches the filter.
     * @param {PodcastFindUniqueArgs} args - Arguments to find a Podcast
     * @example
     * // Get one Podcast
     * const podcast = await prisma.podcast.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PodcastFindUniqueArgs>(args: SelectSubset<T, PodcastFindUniqueArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Podcast that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PodcastFindUniqueOrThrowArgs} args - Arguments to find a Podcast
     * @example
     * // Get one Podcast
     * const podcast = await prisma.podcast.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PodcastFindUniqueOrThrowArgs>(args: SelectSubset<T, PodcastFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Podcast that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastFindFirstArgs} args - Arguments to find a Podcast
     * @example
     * // Get one Podcast
     * const podcast = await prisma.podcast.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PodcastFindFirstArgs>(args?: SelectSubset<T, PodcastFindFirstArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Podcast that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastFindFirstOrThrowArgs} args - Arguments to find a Podcast
     * @example
     * // Get one Podcast
     * const podcast = await prisma.podcast.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PodcastFindFirstOrThrowArgs>(args?: SelectSubset<T, PodcastFindFirstOrThrowArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Podcasts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Podcasts
     * const podcasts = await prisma.podcast.findMany()
     * 
     * // Get first 10 Podcasts
     * const podcasts = await prisma.podcast.findMany({ take: 10 })
     * 
     * // Only select the `podcast_id`
     * const podcastWithPodcast_idOnly = await prisma.podcast.findMany({ select: { podcast_id: true } })
     * 
     */
    findMany<T extends PodcastFindManyArgs>(args?: SelectSubset<T, PodcastFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Podcast.
     * @param {PodcastCreateArgs} args - Arguments to create a Podcast.
     * @example
     * // Create one Podcast
     * const Podcast = await prisma.podcast.create({
     *   data: {
     *     // ... data to create a Podcast
     *   }
     * })
     * 
     */
    create<T extends PodcastCreateArgs>(args: SelectSubset<T, PodcastCreateArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Podcasts.
     * @param {PodcastCreateManyArgs} args - Arguments to create many Podcasts.
     * @example
     * // Create many Podcasts
     * const podcast = await prisma.podcast.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PodcastCreateManyArgs>(args?: SelectSubset<T, PodcastCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Podcasts and returns the data saved in the database.
     * @param {PodcastCreateManyAndReturnArgs} args - Arguments to create many Podcasts.
     * @example
     * // Create many Podcasts
     * const podcast = await prisma.podcast.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Podcasts and only return the `podcast_id`
     * const podcastWithPodcast_idOnly = await prisma.podcast.createManyAndReturn({
     *   select: { podcast_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PodcastCreateManyAndReturnArgs>(args?: SelectSubset<T, PodcastCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Podcast.
     * @param {PodcastDeleteArgs} args - Arguments to delete one Podcast.
     * @example
     * // Delete one Podcast
     * const Podcast = await prisma.podcast.delete({
     *   where: {
     *     // ... filter to delete one Podcast
     *   }
     * })
     * 
     */
    delete<T extends PodcastDeleteArgs>(args: SelectSubset<T, PodcastDeleteArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Podcast.
     * @param {PodcastUpdateArgs} args - Arguments to update one Podcast.
     * @example
     * // Update one Podcast
     * const podcast = await prisma.podcast.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PodcastUpdateArgs>(args: SelectSubset<T, PodcastUpdateArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Podcasts.
     * @param {PodcastDeleteManyArgs} args - Arguments to filter Podcasts to delete.
     * @example
     * // Delete a few Podcasts
     * const { count } = await prisma.podcast.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PodcastDeleteManyArgs>(args?: SelectSubset<T, PodcastDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Podcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Podcasts
     * const podcast = await prisma.podcast.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PodcastUpdateManyArgs>(args: SelectSubset<T, PodcastUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Podcasts and returns the data updated in the database.
     * @param {PodcastUpdateManyAndReturnArgs} args - Arguments to update many Podcasts.
     * @example
     * // Update many Podcasts
     * const podcast = await prisma.podcast.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Podcasts and only return the `podcast_id`
     * const podcastWithPodcast_idOnly = await prisma.podcast.updateManyAndReturn({
     *   select: { podcast_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PodcastUpdateManyAndReturnArgs>(args: SelectSubset<T, PodcastUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Podcast.
     * @param {PodcastUpsertArgs} args - Arguments to update or create a Podcast.
     * @example
     * // Update or create a Podcast
     * const podcast = await prisma.podcast.upsert({
     *   create: {
     *     // ... data to create a Podcast
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Podcast we want to update
     *   }
     * })
     */
    upsert<T extends PodcastUpsertArgs>(args: SelectSubset<T, PodcastUpsertArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Podcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastCountArgs} args - Arguments to filter Podcasts to count.
     * @example
     * // Count the number of Podcasts
     * const count = await prisma.podcast.count({
     *   where: {
     *     // ... the filter for the Podcasts we want to count
     *   }
     * })
    **/
    count<T extends PodcastCountArgs>(
      args?: Subset<T, PodcastCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PodcastCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Podcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PodcastAggregateArgs>(args: Subset<T, PodcastAggregateArgs>): Prisma.PrismaPromise<GetPodcastAggregateType<T>>

    /**
     * Group by Podcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PodcastGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PodcastGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PodcastGroupByArgs['orderBy'] }
        : { orderBy?: PodcastGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PodcastGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPodcastGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Podcast model
   */
  readonly fields: PodcastFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Podcast.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PodcastClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle_podcast<T extends Podcast$bundle_podcastArgs<ExtArgs> = {}>(args?: Subset<T, Podcast$bundle_podcastArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    episode<T extends Podcast$episodeArgs<ExtArgs> = {}>(args?: Subset<T, Podcast$episodeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends Podcast$userArgs<ExtArgs> = {}>(args?: Subset<T, Podcast$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    profile_podcast<T extends Podcast$profile_podcastArgs<ExtArgs> = {}>(args?: Subset<T, Podcast$profile_podcastArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Podcast model
   */
  interface PodcastFieldRefs {
    readonly podcast_id: FieldRef<"Podcast", 'String'>
    readonly name: FieldRef<"Podcast", 'String'>
    readonly description: FieldRef<"Podcast", 'String'>
    readonly url: FieldRef<"Podcast", 'String'>
    readonly image_url: FieldRef<"Podcast", 'String'>
    readonly category: FieldRef<"Podcast", 'String'>
    readonly is_active: FieldRef<"Podcast", 'Boolean'>
    readonly owner_user_id: FieldRef<"Podcast", 'String'>
    readonly created_at: FieldRef<"Podcast", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Podcast findUnique
   */
  export type PodcastFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter, which Podcast to fetch.
     */
    where: PodcastWhereUniqueInput
  }

  /**
   * Podcast findUniqueOrThrow
   */
  export type PodcastFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter, which Podcast to fetch.
     */
    where: PodcastWhereUniqueInput
  }

  /**
   * Podcast findFirst
   */
  export type PodcastFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter, which Podcast to fetch.
     */
    where?: PodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Podcasts to fetch.
     */
    orderBy?: PodcastOrderByWithRelationInput | PodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Podcasts.
     */
    cursor?: PodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Podcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Podcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Podcasts.
     */
    distinct?: PodcastScalarFieldEnum | PodcastScalarFieldEnum[]
  }

  /**
   * Podcast findFirstOrThrow
   */
  export type PodcastFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter, which Podcast to fetch.
     */
    where?: PodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Podcasts to fetch.
     */
    orderBy?: PodcastOrderByWithRelationInput | PodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Podcasts.
     */
    cursor?: PodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Podcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Podcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Podcasts.
     */
    distinct?: PodcastScalarFieldEnum | PodcastScalarFieldEnum[]
  }

  /**
   * Podcast findMany
   */
  export type PodcastFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter, which Podcasts to fetch.
     */
    where?: PodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Podcasts to fetch.
     */
    orderBy?: PodcastOrderByWithRelationInput | PodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Podcasts.
     */
    cursor?: PodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Podcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Podcasts.
     */
    skip?: number
    distinct?: PodcastScalarFieldEnum | PodcastScalarFieldEnum[]
  }

  /**
   * Podcast create
   */
  export type PodcastCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * The data needed to create a Podcast.
     */
    data: XOR<PodcastCreateInput, PodcastUncheckedCreateInput>
  }

  /**
   * Podcast createMany
   */
  export type PodcastCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Podcasts.
     */
    data: PodcastCreateManyInput | PodcastCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Podcast createManyAndReturn
   */
  export type PodcastCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * The data used to create many Podcasts.
     */
    data: PodcastCreateManyInput | PodcastCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Podcast update
   */
  export type PodcastUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * The data needed to update a Podcast.
     */
    data: XOR<PodcastUpdateInput, PodcastUncheckedUpdateInput>
    /**
     * Choose, which Podcast to update.
     */
    where: PodcastWhereUniqueInput
  }

  /**
   * Podcast updateMany
   */
  export type PodcastUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Podcasts.
     */
    data: XOR<PodcastUpdateManyMutationInput, PodcastUncheckedUpdateManyInput>
    /**
     * Filter which Podcasts to update
     */
    where?: PodcastWhereInput
    /**
     * Limit how many Podcasts to update.
     */
    limit?: number
  }

  /**
   * Podcast updateManyAndReturn
   */
  export type PodcastUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * The data used to update Podcasts.
     */
    data: XOR<PodcastUpdateManyMutationInput, PodcastUncheckedUpdateManyInput>
    /**
     * Filter which Podcasts to update
     */
    where?: PodcastWhereInput
    /**
     * Limit how many Podcasts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Podcast upsert
   */
  export type PodcastUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * The filter to search for the Podcast to update in case it exists.
     */
    where: PodcastWhereUniqueInput
    /**
     * In case the Podcast found by the `where` argument doesn't exist, create a new Podcast with this data.
     */
    create: XOR<PodcastCreateInput, PodcastUncheckedCreateInput>
    /**
     * In case the Podcast was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PodcastUpdateInput, PodcastUncheckedUpdateInput>
  }

  /**
   * Podcast delete
   */
  export type PodcastDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    /**
     * Filter which Podcast to delete.
     */
    where: PodcastWhereUniqueInput
  }

  /**
   * Podcast deleteMany
   */
  export type PodcastDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Podcasts to delete
     */
    where?: PodcastWhereInput
    /**
     * Limit how many Podcasts to delete.
     */
    limit?: number
  }

  /**
   * Podcast.bundle_podcast
   */
  export type Podcast$bundle_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundlePodcast
     */
    select?: BundlePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BundlePodcast
     */
    omit?: BundlePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundlePodcastInclude<ExtArgs> | null
    where?: BundlePodcastWhereInput
    orderBy?: BundlePodcastOrderByWithRelationInput | BundlePodcastOrderByWithRelationInput[]
    cursor?: BundlePodcastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BundlePodcastScalarFieldEnum | BundlePodcastScalarFieldEnum[]
  }

  /**
   * Podcast.episode
   */
  export type Podcast$episodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    where?: EpisodeWhereInput
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    cursor?: EpisodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * Podcast.user
   */
  export type Podcast$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Podcast.profile_podcast
   */
  export type Podcast$profile_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    where?: ProfilePodcastWhereInput
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    cursor?: ProfilePodcastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfilePodcastScalarFieldEnum | ProfilePodcastScalarFieldEnum[]
  }

  /**
   * Podcast without action
   */
  export type PodcastDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
  }


  /**
   * Model ProfilePodcast
   */

  export type AggregateProfilePodcast = {
    _count: ProfilePodcastCountAggregateOutputType | null
    _min: ProfilePodcastMinAggregateOutputType | null
    _max: ProfilePodcastMaxAggregateOutputType | null
  }

  export type ProfilePodcastMinAggregateOutputType = {
    profile_id: string | null
    podcast_id: string | null
  }

  export type ProfilePodcastMaxAggregateOutputType = {
    profile_id: string | null
    podcast_id: string | null
  }

  export type ProfilePodcastCountAggregateOutputType = {
    profile_id: number
    podcast_id: number
    _all: number
  }


  export type ProfilePodcastMinAggregateInputType = {
    profile_id?: true
    podcast_id?: true
  }

  export type ProfilePodcastMaxAggregateInputType = {
    profile_id?: true
    podcast_id?: true
  }

  export type ProfilePodcastCountAggregateInputType = {
    profile_id?: true
    podcast_id?: true
    _all?: true
  }

  export type ProfilePodcastAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfilePodcast to aggregate.
     */
    where?: ProfilePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePodcasts to fetch.
     */
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfilePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfilePodcasts
    **/
    _count?: true | ProfilePodcastCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfilePodcastMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfilePodcastMaxAggregateInputType
  }

  export type GetProfilePodcastAggregateType<T extends ProfilePodcastAggregateArgs> = {
        [P in keyof T & keyof AggregateProfilePodcast]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfilePodcast[P]>
      : GetScalarType<T[P], AggregateProfilePodcast[P]>
  }




  export type ProfilePodcastGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfilePodcastWhereInput
    orderBy?: ProfilePodcastOrderByWithAggregationInput | ProfilePodcastOrderByWithAggregationInput[]
    by: ProfilePodcastScalarFieldEnum[] | ProfilePodcastScalarFieldEnum
    having?: ProfilePodcastScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfilePodcastCountAggregateInputType | true
    _min?: ProfilePodcastMinAggregateInputType
    _max?: ProfilePodcastMaxAggregateInputType
  }

  export type ProfilePodcastGroupByOutputType = {
    profile_id: string
    podcast_id: string
    _count: ProfilePodcastCountAggregateOutputType | null
    _min: ProfilePodcastMinAggregateOutputType | null
    _max: ProfilePodcastMaxAggregateOutputType | null
  }

  type GetProfilePodcastGroupByPayload<T extends ProfilePodcastGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfilePodcastGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfilePodcastGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfilePodcastGroupByOutputType[P]>
            : GetScalarType<T[P], ProfilePodcastGroupByOutputType[P]>
        }
      >
    >


  export type ProfilePodcastSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    podcast_id?: boolean
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePodcast"]>

  export type ProfilePodcastSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    podcast_id?: boolean
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePodcast"]>

  export type ProfilePodcastSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    podcast_id?: boolean
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profilePodcast"]>

  export type ProfilePodcastSelectScalar = {
    profile_id?: boolean
    podcast_id?: boolean
  }

  export type ProfilePodcastOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"profile_id" | "podcast_id", ExtArgs["result"]["profilePodcast"]>
  export type ProfilePodcastInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }
  export type ProfilePodcastIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }
  export type ProfilePodcastIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    podcast?: boolean | PodcastDefaultArgs<ExtArgs>
    user_curation_profile?: boolean | UserCurationProfileDefaultArgs<ExtArgs>
  }

  export type $ProfilePodcastPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfilePodcast"
    objects: {
      podcast: Prisma.$PodcastPayload<ExtArgs>
      user_curation_profile: Prisma.$UserCurationProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      profile_id: string
      podcast_id: string
    }, ExtArgs["result"]["profilePodcast"]>
    composites: {}
  }

  type ProfilePodcastGetPayload<S extends boolean | null | undefined | ProfilePodcastDefaultArgs> = $Result.GetResult<Prisma.$ProfilePodcastPayload, S>

  type ProfilePodcastCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfilePodcastFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfilePodcastCountAggregateInputType | true
    }

  export interface ProfilePodcastDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfilePodcast'], meta: { name: 'ProfilePodcast' } }
    /**
     * Find zero or one ProfilePodcast that matches the filter.
     * @param {ProfilePodcastFindUniqueArgs} args - Arguments to find a ProfilePodcast
     * @example
     * // Get one ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfilePodcastFindUniqueArgs>(args: SelectSubset<T, ProfilePodcastFindUniqueArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProfilePodcast that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfilePodcastFindUniqueOrThrowArgs} args - Arguments to find a ProfilePodcast
     * @example
     * // Get one ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfilePodcastFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfilePodcastFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfilePodcast that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastFindFirstArgs} args - Arguments to find a ProfilePodcast
     * @example
     * // Get one ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfilePodcastFindFirstArgs>(args?: SelectSubset<T, ProfilePodcastFindFirstArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfilePodcast that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastFindFirstOrThrowArgs} args - Arguments to find a ProfilePodcast
     * @example
     * // Get one ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfilePodcastFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfilePodcastFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProfilePodcasts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfilePodcasts
     * const profilePodcasts = await prisma.profilePodcast.findMany()
     * 
     * // Get first 10 ProfilePodcasts
     * const profilePodcasts = await prisma.profilePodcast.findMany({ take: 10 })
     * 
     * // Only select the `profile_id`
     * const profilePodcastWithProfile_idOnly = await prisma.profilePodcast.findMany({ select: { profile_id: true } })
     * 
     */
    findMany<T extends ProfilePodcastFindManyArgs>(args?: SelectSubset<T, ProfilePodcastFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProfilePodcast.
     * @param {ProfilePodcastCreateArgs} args - Arguments to create a ProfilePodcast.
     * @example
     * // Create one ProfilePodcast
     * const ProfilePodcast = await prisma.profilePodcast.create({
     *   data: {
     *     // ... data to create a ProfilePodcast
     *   }
     * })
     * 
     */
    create<T extends ProfilePodcastCreateArgs>(args: SelectSubset<T, ProfilePodcastCreateArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProfilePodcasts.
     * @param {ProfilePodcastCreateManyArgs} args - Arguments to create many ProfilePodcasts.
     * @example
     * // Create many ProfilePodcasts
     * const profilePodcast = await prisma.profilePodcast.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfilePodcastCreateManyArgs>(args?: SelectSubset<T, ProfilePodcastCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfilePodcasts and returns the data saved in the database.
     * @param {ProfilePodcastCreateManyAndReturnArgs} args - Arguments to create many ProfilePodcasts.
     * @example
     * // Create many ProfilePodcasts
     * const profilePodcast = await prisma.profilePodcast.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfilePodcasts and only return the `profile_id`
     * const profilePodcastWithProfile_idOnly = await prisma.profilePodcast.createManyAndReturn({
     *   select: { profile_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfilePodcastCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfilePodcastCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProfilePodcast.
     * @param {ProfilePodcastDeleteArgs} args - Arguments to delete one ProfilePodcast.
     * @example
     * // Delete one ProfilePodcast
     * const ProfilePodcast = await prisma.profilePodcast.delete({
     *   where: {
     *     // ... filter to delete one ProfilePodcast
     *   }
     * })
     * 
     */
    delete<T extends ProfilePodcastDeleteArgs>(args: SelectSubset<T, ProfilePodcastDeleteArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProfilePodcast.
     * @param {ProfilePodcastUpdateArgs} args - Arguments to update one ProfilePodcast.
     * @example
     * // Update one ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfilePodcastUpdateArgs>(args: SelectSubset<T, ProfilePodcastUpdateArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProfilePodcasts.
     * @param {ProfilePodcastDeleteManyArgs} args - Arguments to filter ProfilePodcasts to delete.
     * @example
     * // Delete a few ProfilePodcasts
     * const { count } = await prisma.profilePodcast.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfilePodcastDeleteManyArgs>(args?: SelectSubset<T, ProfilePodcastDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfilePodcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfilePodcasts
     * const profilePodcast = await prisma.profilePodcast.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfilePodcastUpdateManyArgs>(args: SelectSubset<T, ProfilePodcastUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfilePodcasts and returns the data updated in the database.
     * @param {ProfilePodcastUpdateManyAndReturnArgs} args - Arguments to update many ProfilePodcasts.
     * @example
     * // Update many ProfilePodcasts
     * const profilePodcast = await prisma.profilePodcast.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProfilePodcasts and only return the `profile_id`
     * const profilePodcastWithProfile_idOnly = await prisma.profilePodcast.updateManyAndReturn({
     *   select: { profile_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfilePodcastUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfilePodcastUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProfilePodcast.
     * @param {ProfilePodcastUpsertArgs} args - Arguments to update or create a ProfilePodcast.
     * @example
     * // Update or create a ProfilePodcast
     * const profilePodcast = await prisma.profilePodcast.upsert({
     *   create: {
     *     // ... data to create a ProfilePodcast
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfilePodcast we want to update
     *   }
     * })
     */
    upsert<T extends ProfilePodcastUpsertArgs>(args: SelectSubset<T, ProfilePodcastUpsertArgs<ExtArgs>>): Prisma__ProfilePodcastClient<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProfilePodcasts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastCountArgs} args - Arguments to filter ProfilePodcasts to count.
     * @example
     * // Count the number of ProfilePodcasts
     * const count = await prisma.profilePodcast.count({
     *   where: {
     *     // ... the filter for the ProfilePodcasts we want to count
     *   }
     * })
    **/
    count<T extends ProfilePodcastCountArgs>(
      args?: Subset<T, ProfilePodcastCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfilePodcastCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfilePodcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfilePodcastAggregateArgs>(args: Subset<T, ProfilePodcastAggregateArgs>): Prisma.PrismaPromise<GetProfilePodcastAggregateType<T>>

    /**
     * Group by ProfilePodcast.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilePodcastGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfilePodcastGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfilePodcastGroupByArgs['orderBy'] }
        : { orderBy?: ProfilePodcastGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfilePodcastGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfilePodcastGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfilePodcast model
   */
  readonly fields: ProfilePodcastFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfilePodcast.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfilePodcastClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    podcast<T extends PodcastDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PodcastDefaultArgs<ExtArgs>>): Prisma__PodcastClient<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user_curation_profile<T extends UserCurationProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserCurationProfileDefaultArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProfilePodcast model
   */
  interface ProfilePodcastFieldRefs {
    readonly profile_id: FieldRef<"ProfilePodcast", 'String'>
    readonly podcast_id: FieldRef<"ProfilePodcast", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProfilePodcast findUnique
   */
  export type ProfilePodcastFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePodcast to fetch.
     */
    where: ProfilePodcastWhereUniqueInput
  }

  /**
   * ProfilePodcast findUniqueOrThrow
   */
  export type ProfilePodcastFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePodcast to fetch.
     */
    where: ProfilePodcastWhereUniqueInput
  }

  /**
   * ProfilePodcast findFirst
   */
  export type ProfilePodcastFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePodcast to fetch.
     */
    where?: ProfilePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePodcasts to fetch.
     */
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfilePodcasts.
     */
    cursor?: ProfilePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfilePodcasts.
     */
    distinct?: ProfilePodcastScalarFieldEnum | ProfilePodcastScalarFieldEnum[]
  }

  /**
   * ProfilePodcast findFirstOrThrow
   */
  export type ProfilePodcastFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePodcast to fetch.
     */
    where?: ProfilePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePodcasts to fetch.
     */
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfilePodcasts.
     */
    cursor?: ProfilePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePodcasts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfilePodcasts.
     */
    distinct?: ProfilePodcastScalarFieldEnum | ProfilePodcastScalarFieldEnum[]
  }

  /**
   * ProfilePodcast findMany
   */
  export type ProfilePodcastFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter, which ProfilePodcasts to fetch.
     */
    where?: ProfilePodcastWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfilePodcasts to fetch.
     */
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfilePodcasts.
     */
    cursor?: ProfilePodcastWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfilePodcasts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfilePodcasts.
     */
    skip?: number
    distinct?: ProfilePodcastScalarFieldEnum | ProfilePodcastScalarFieldEnum[]
  }

  /**
   * ProfilePodcast create
   */
  export type ProfilePodcastCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfilePodcast.
     */
    data: XOR<ProfilePodcastCreateInput, ProfilePodcastUncheckedCreateInput>
  }

  /**
   * ProfilePodcast createMany
   */
  export type ProfilePodcastCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfilePodcasts.
     */
    data: ProfilePodcastCreateManyInput | ProfilePodcastCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfilePodcast createManyAndReturn
   */
  export type ProfilePodcastCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * The data used to create many ProfilePodcasts.
     */
    data: ProfilePodcastCreateManyInput | ProfilePodcastCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfilePodcast update
   */
  export type ProfilePodcastUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfilePodcast.
     */
    data: XOR<ProfilePodcastUpdateInput, ProfilePodcastUncheckedUpdateInput>
    /**
     * Choose, which ProfilePodcast to update.
     */
    where: ProfilePodcastWhereUniqueInput
  }

  /**
   * ProfilePodcast updateMany
   */
  export type ProfilePodcastUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfilePodcasts.
     */
    data: XOR<ProfilePodcastUpdateManyMutationInput, ProfilePodcastUncheckedUpdateManyInput>
    /**
     * Filter which ProfilePodcasts to update
     */
    where?: ProfilePodcastWhereInput
    /**
     * Limit how many ProfilePodcasts to update.
     */
    limit?: number
  }

  /**
   * ProfilePodcast updateManyAndReturn
   */
  export type ProfilePodcastUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * The data used to update ProfilePodcasts.
     */
    data: XOR<ProfilePodcastUpdateManyMutationInput, ProfilePodcastUncheckedUpdateManyInput>
    /**
     * Filter which ProfilePodcasts to update
     */
    where?: ProfilePodcastWhereInput
    /**
     * Limit how many ProfilePodcasts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfilePodcast upsert
   */
  export type ProfilePodcastUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfilePodcast to update in case it exists.
     */
    where: ProfilePodcastWhereUniqueInput
    /**
     * In case the ProfilePodcast found by the `where` argument doesn't exist, create a new ProfilePodcast with this data.
     */
    create: XOR<ProfilePodcastCreateInput, ProfilePodcastUncheckedCreateInput>
    /**
     * In case the ProfilePodcast was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfilePodcastUpdateInput, ProfilePodcastUncheckedUpdateInput>
  }

  /**
   * ProfilePodcast delete
   */
  export type ProfilePodcastDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    /**
     * Filter which ProfilePodcast to delete.
     */
    where: ProfilePodcastWhereUniqueInput
  }

  /**
   * ProfilePodcast deleteMany
   */
  export type ProfilePodcastDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfilePodcasts to delete
     */
    where?: ProfilePodcastWhereInput
    /**
     * Limit how many ProfilePodcasts to delete.
     */
    limit?: number
  }

  /**
   * ProfilePodcast without action
   */
  export type ProfilePodcastDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    subscription_id: string | null
    user_id: string | null
    link_customer_id: string | null
    link_subscription_id: string | null
    link_price_id: string | null
    status: string | null
    current_period_start: Date | null
    current_period_end: Date | null
    trail_start: Date | null
    trial_end: Date | null
    canceled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    subscription_id: string | null
    user_id: string | null
    link_customer_id: string | null
    link_subscription_id: string | null
    link_price_id: string | null
    status: string | null
    current_period_start: Date | null
    current_period_end: Date | null
    trail_start: Date | null
    trial_end: Date | null
    canceled_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    subscription_id: number
    user_id: number
    link_customer_id: number
    link_subscription_id: number
    link_price_id: number
    status: number
    current_period_start: number
    current_period_end: number
    trail_start: number
    trial_end: number
    canceled_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    subscription_id?: true
    user_id?: true
    link_customer_id?: true
    link_subscription_id?: true
    link_price_id?: true
    status?: true
    current_period_start?: true
    current_period_end?: true
    trail_start?: true
    trial_end?: true
    canceled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    subscription_id?: true
    user_id?: true
    link_customer_id?: true
    link_subscription_id?: true
    link_price_id?: true
    status?: true
    current_period_start?: true
    current_period_end?: true
    trail_start?: true
    trial_end?: true
    canceled_at?: true
    created_at?: true
    updated_at?: true
  }

  export type SubscriptionCountAggregateInputType = {
    subscription_id?: true
    user_id?: true
    link_customer_id?: true
    link_subscription_id?: true
    link_price_id?: true
    status?: true
    current_period_start?: true
    current_period_end?: true
    trail_start?: true
    trial_end?: true
    canceled_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    subscription_id: string
    user_id: string
    link_customer_id: string | null
    link_subscription_id: string | null
    link_price_id: string | null
    status: string
    current_period_start: Date | null
    current_period_end: Date | null
    trail_start: Date | null
    trial_end: Date | null
    canceled_at: Date | null
    created_at: Date
    updated_at: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    subscription_id?: boolean
    user_id?: boolean
    link_customer_id?: boolean
    link_subscription_id?: boolean
    link_price_id?: boolean
    status?: boolean
    current_period_start?: boolean
    current_period_end?: boolean
    trail_start?: boolean
    trial_end?: boolean
    canceled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    subscription_id?: boolean
    user_id?: boolean
    link_customer_id?: boolean
    link_subscription_id?: boolean
    link_price_id?: boolean
    status?: boolean
    current_period_start?: boolean
    current_period_end?: boolean
    trail_start?: boolean
    trial_end?: boolean
    canceled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    subscription_id?: boolean
    user_id?: boolean
    link_customer_id?: boolean
    link_subscription_id?: boolean
    link_price_id?: boolean
    status?: boolean
    current_period_start?: boolean
    current_period_end?: boolean
    trail_start?: boolean
    trial_end?: boolean
    canceled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    subscription_id?: boolean
    user_id?: boolean
    link_customer_id?: boolean
    link_subscription_id?: boolean
    link_price_id?: boolean
    status?: boolean
    current_period_start?: boolean
    current_period_end?: boolean
    trail_start?: boolean
    trial_end?: boolean
    canceled_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"subscription_id" | "user_id" | "link_customer_id" | "link_subscription_id" | "link_price_id" | "status" | "current_period_start" | "current_period_end" | "trail_start" | "trial_end" | "canceled_at" | "created_at" | "updated_at", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      subscription_id: string
      user_id: string
      link_customer_id: string | null
      link_subscription_id: string | null
      link_price_id: string | null
      status: string
      current_period_start: Date | null
      current_period_end: Date | null
      trail_start: Date | null
      trial_end: Date | null
      canceled_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `subscription_id`
     * const subscriptionWithSubscription_idOnly = await prisma.subscription.findMany({ select: { subscription_id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `subscription_id`
     * const subscriptionWithSubscription_idOnly = await prisma.subscription.createManyAndReturn({
     *   select: { subscription_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `subscription_id`
     * const subscriptionWithSubscription_idOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { subscription_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly subscription_id: FieldRef<"Subscription", 'String'>
    readonly user_id: FieldRef<"Subscription", 'String'>
    readonly link_customer_id: FieldRef<"Subscription", 'String'>
    readonly link_subscription_id: FieldRef<"Subscription", 'String'>
    readonly link_price_id: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly current_period_start: FieldRef<"Subscription", 'DateTime'>
    readonly current_period_end: FieldRef<"Subscription", 'DateTime'>
    readonly trail_start: FieldRef<"Subscription", 'DateTime'>
    readonly trial_end: FieldRef<"Subscription", 'DateTime'>
    readonly canceled_at: FieldRef<"Subscription", 'DateTime'>
    readonly created_at: FieldRef<"Subscription", 'DateTime'>
    readonly updated_at: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    user_id: string | null
    name: string | null
    email: string | null
    password: string | null
    image: string | null
    email_verified: Date | null
    is_admin: boolean | null
    email_notifications: boolean | null
    in_app_notifications: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    user_id: string | null
    name: string | null
    email: string | null
    password: string | null
    image: string | null
    email_verified: Date | null
    is_admin: boolean | null
    email_notifications: boolean | null
    in_app_notifications: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    user_id: number
    name: number
    email: number
    password: number
    image: number
    email_verified: number
    is_admin: number
    email_notifications: number
    in_app_notifications: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    user_id?: true
    name?: true
    email?: true
    password?: true
    image?: true
    email_verified?: true
    is_admin?: true
    email_notifications?: true
    in_app_notifications?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    user_id?: true
    name?: true
    email?: true
    password?: true
    image?: true
    email_verified?: true
    is_admin?: true
    email_notifications?: true
    in_app_notifications?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    user_id?: true
    name?: true
    email?: true
    password?: true
    image?: true
    email_verified?: true
    is_admin?: true
    email_notifications?: true
    in_app_notifications?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    user_id: string
    name: string | null
    email: string
    password: string
    image: string | null
    email_verified: Date | null
    is_admin: boolean
    email_notifications: boolean
    in_app_notifications: boolean
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    email_verified?: boolean
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: boolean
    updated_at?: boolean
    bundle?: boolean | User$bundleArgs<ExtArgs>
    feedback?: boolean | User$feedbackArgs<ExtArgs>
    notification?: boolean | User$notificationArgs<ExtArgs>
    podcast?: boolean | User$podcastArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    user_curation_profile?: boolean | User$user_curation_profileArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    email_verified?: boolean
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    email_verified?: boolean
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    user_id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    email_verified?: boolean
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "name" | "email" | "password" | "image" | "email_verified" | "is_admin" | "email_notifications" | "in_app_notifications" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | User$bundleArgs<ExtArgs>
    feedback?: boolean | User$feedbackArgs<ExtArgs>
    notification?: boolean | User$notificationArgs<ExtArgs>
    podcast?: boolean | User$podcastArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    user_curation_profile?: boolean | User$user_curation_profileArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      bundle: Prisma.$BundlePayload<ExtArgs>[]
      feedback: Prisma.$EpisodeFeedbackPayload<ExtArgs>[]
      notification: Prisma.$NotificationPayload<ExtArgs>[]
      podcast: Prisma.$PodcastPayload<ExtArgs>[]
      subscription: Prisma.$SubscriptionPayload<ExtArgs>[]
      user_curation_profile: Prisma.$UserCurationProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      name: string | null
      email: string
      password: string
      image: string | null
      email_verified: Date | null
      is_admin: boolean
      email_notifications: boolean
      in_app_notifications: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const userWithUser_idOnly = await prisma.user.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `user_id`
     * const userWithUser_idOnly = await prisma.user.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `user_id`
     * const userWithUser_idOnly = await prisma.user.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends User$bundleArgs<ExtArgs> = {}>(args?: Subset<T, User$bundleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedback<T extends User$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, User$feedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodeFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notification<T extends User$notificationArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    podcast<T extends User$podcastArgs<ExtArgs> = {}>(args?: Subset<T, User$podcastArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_curation_profile<T extends User$user_curation_profileArgs<ExtArgs> = {}>(args?: Subset<T, User$user_curation_profileArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly user_id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly email_verified: FieldRef<"User", 'DateTime'>
    readonly is_admin: FieldRef<"User", 'Boolean'>
    readonly email_notifications: FieldRef<"User", 'Boolean'>
    readonly in_app_notifications: FieldRef<"User", 'Boolean'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.bundle
   */
  export type User$bundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    where?: BundleWhereInput
    orderBy?: BundleOrderByWithRelationInput | BundleOrderByWithRelationInput[]
    cursor?: BundleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * User.feedback
   */
  export type User$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EpisodeFeedback
     */
    select?: EpisodeFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EpisodeFeedback
     */
    omit?: EpisodeFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeFeedbackInclude<ExtArgs> | null
    where?: EpisodeFeedbackWhereInput
    orderBy?: EpisodeFeedbackOrderByWithRelationInput | EpisodeFeedbackOrderByWithRelationInput[]
    cursor?: EpisodeFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EpisodeFeedbackScalarFieldEnum | EpisodeFeedbackScalarFieldEnum[]
  }

  /**
   * User.notification
   */
  export type User$notificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.podcast
   */
  export type User$podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Podcast
     */
    select?: PodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Podcast
     */
    omit?: PodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PodcastInclude<ExtArgs> | null
    where?: PodcastWhereInput
    orderBy?: PodcastOrderByWithRelationInput | PodcastOrderByWithRelationInput[]
    cursor?: PodcastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PodcastScalarFieldEnum | PodcastScalarFieldEnum[]
  }

  /**
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * User.user_curation_profile
   */
  export type User$user_curation_profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    where?: UserCurationProfileWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserCurationProfile
   */

  export type AggregateUserCurationProfile = {
    _count: UserCurationProfileCountAggregateOutputType | null
    _min: UserCurationProfileMinAggregateOutputType | null
    _max: UserCurationProfileMaxAggregateOutputType | null
  }

  export type UserCurationProfileMinAggregateOutputType = {
    profile_id: string | null
    user_id: string | null
    name: string | null
    status: string | null
    audio_url: string | null
    image_url: string | null
    created_at: Date | null
    updated_at: Date | null
    generated_at: Date | null
    last_generation_date: Date | null
    next_generation_date: Date | null
    is_active: boolean | null
    is_bundle_selection: boolean | null
    selected_bundle_id: string | null
  }

  export type UserCurationProfileMaxAggregateOutputType = {
    profile_id: string | null
    user_id: string | null
    name: string | null
    status: string | null
    audio_url: string | null
    image_url: string | null
    created_at: Date | null
    updated_at: Date | null
    generated_at: Date | null
    last_generation_date: Date | null
    next_generation_date: Date | null
    is_active: boolean | null
    is_bundle_selection: boolean | null
    selected_bundle_id: string | null
  }

  export type UserCurationProfileCountAggregateOutputType = {
    profile_id: number
    user_id: number
    name: number
    status: number
    audio_url: number
    image_url: number
    created_at: number
    updated_at: number
    generated_at: number
    last_generation_date: number
    next_generation_date: number
    is_active: number
    is_bundle_selection: number
    selected_bundle_id: number
    _all: number
  }


  export type UserCurationProfileMinAggregateInputType = {
    profile_id?: true
    user_id?: true
    name?: true
    status?: true
    audio_url?: true
    image_url?: true
    created_at?: true
    updated_at?: true
    generated_at?: true
    last_generation_date?: true
    next_generation_date?: true
    is_active?: true
    is_bundle_selection?: true
    selected_bundle_id?: true
  }

  export type UserCurationProfileMaxAggregateInputType = {
    profile_id?: true
    user_id?: true
    name?: true
    status?: true
    audio_url?: true
    image_url?: true
    created_at?: true
    updated_at?: true
    generated_at?: true
    last_generation_date?: true
    next_generation_date?: true
    is_active?: true
    is_bundle_selection?: true
    selected_bundle_id?: true
  }

  export type UserCurationProfileCountAggregateInputType = {
    profile_id?: true
    user_id?: true
    name?: true
    status?: true
    audio_url?: true
    image_url?: true
    created_at?: true
    updated_at?: true
    generated_at?: true
    last_generation_date?: true
    next_generation_date?: true
    is_active?: true
    is_bundle_selection?: true
    selected_bundle_id?: true
    _all?: true
  }

  export type UserCurationProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCurationProfile to aggregate.
     */
    where?: UserCurationProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCurationProfiles to fetch.
     */
    orderBy?: UserCurationProfileOrderByWithRelationInput | UserCurationProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCurationProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCurationProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCurationProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCurationProfiles
    **/
    _count?: true | UserCurationProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCurationProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCurationProfileMaxAggregateInputType
  }

  export type GetUserCurationProfileAggregateType<T extends UserCurationProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCurationProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCurationProfile[P]>
      : GetScalarType<T[P], AggregateUserCurationProfile[P]>
  }




  export type UserCurationProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCurationProfileWhereInput
    orderBy?: UserCurationProfileOrderByWithAggregationInput | UserCurationProfileOrderByWithAggregationInput[]
    by: UserCurationProfileScalarFieldEnum[] | UserCurationProfileScalarFieldEnum
    having?: UserCurationProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCurationProfileCountAggregateInputType | true
    _min?: UserCurationProfileMinAggregateInputType
    _max?: UserCurationProfileMaxAggregateInputType
  }

  export type UserCurationProfileGroupByOutputType = {
    profile_id: string
    user_id: string
    name: string
    status: string
    audio_url: string | null
    image_url: string | null
    created_at: Date
    updated_at: Date
    generated_at: Date | null
    last_generation_date: Date | null
    next_generation_date: Date | null
    is_active: boolean
    is_bundle_selection: boolean
    selected_bundle_id: string | null
    _count: UserCurationProfileCountAggregateOutputType | null
    _min: UserCurationProfileMinAggregateOutputType | null
    _max: UserCurationProfileMaxAggregateOutputType | null
  }

  type GetUserCurationProfileGroupByPayload<T extends UserCurationProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserCurationProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCurationProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCurationProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserCurationProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserCurationProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    user_id?: boolean
    name?: boolean
    status?: boolean
    audio_url?: boolean
    image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    generated_at?: boolean
    last_generation_date?: boolean
    next_generation_date?: boolean
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: boolean
    episode?: boolean | UserCurationProfile$episodeArgs<ExtArgs>
    profile_podcast?: boolean | UserCurationProfile$profile_podcastArgs<ExtArgs>
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | UserCurationProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCurationProfile"]>

  export type UserCurationProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    user_id?: boolean
    name?: boolean
    status?: boolean
    audio_url?: boolean
    image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    generated_at?: boolean
    last_generation_date?: boolean
    next_generation_date?: boolean
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: boolean
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCurationProfile"]>

  export type UserCurationProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profile_id?: boolean
    user_id?: boolean
    name?: boolean
    status?: boolean
    audio_url?: boolean
    image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    generated_at?: boolean
    last_generation_date?: boolean
    next_generation_date?: boolean
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: boolean
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCurationProfile"]>

  export type UserCurationProfileSelectScalar = {
    profile_id?: boolean
    user_id?: boolean
    name?: boolean
    status?: boolean
    audio_url?: boolean
    image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    generated_at?: boolean
    last_generation_date?: boolean
    next_generation_date?: boolean
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: boolean
  }

  export type UserCurationProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"profile_id" | "user_id" | "name" | "status" | "audio_url" | "image_url" | "created_at" | "updated_at" | "generated_at" | "last_generation_date" | "next_generation_date" | "is_active" | "is_bundle_selection" | "selected_bundle_id", ExtArgs["result"]["userCurationProfile"]>
  export type UserCurationProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    episode?: boolean | UserCurationProfile$episodeArgs<ExtArgs>
    profile_podcast?: boolean | UserCurationProfile$profile_podcastArgs<ExtArgs>
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | UserCurationProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserCurationProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserCurationProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | UserCurationProfile$bundleArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserCurationProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserCurationProfile"
    objects: {
      episode: Prisma.$EpisodePayload<ExtArgs>[]
      profile_podcast: Prisma.$ProfilePodcastPayload<ExtArgs>[]
      bundle: Prisma.$BundlePayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      profile_id: string
      user_id: string
      name: string
      status: string
      audio_url: string | null
      image_url: string | null
      created_at: Date
      updated_at: Date
      generated_at: Date | null
      last_generation_date: Date | null
      next_generation_date: Date | null
      is_active: boolean
      is_bundle_selection: boolean
      selected_bundle_id: string | null
    }, ExtArgs["result"]["userCurationProfile"]>
    composites: {}
  }

  type UserCurationProfileGetPayload<S extends boolean | null | undefined | UserCurationProfileDefaultArgs> = $Result.GetResult<Prisma.$UserCurationProfilePayload, S>

  type UserCurationProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserCurationProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCurationProfileCountAggregateInputType | true
    }

  export interface UserCurationProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserCurationProfile'], meta: { name: 'UserCurationProfile' } }
    /**
     * Find zero or one UserCurationProfile that matches the filter.
     * @param {UserCurationProfileFindUniqueArgs} args - Arguments to find a UserCurationProfile
     * @example
     * // Get one UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCurationProfileFindUniqueArgs>(args: SelectSubset<T, UserCurationProfileFindUniqueArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserCurationProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCurationProfileFindUniqueOrThrowArgs} args - Arguments to find a UserCurationProfile
     * @example
     * // Get one UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCurationProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserCurationProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCurationProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileFindFirstArgs} args - Arguments to find a UserCurationProfile
     * @example
     * // Get one UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCurationProfileFindFirstArgs>(args?: SelectSubset<T, UserCurationProfileFindFirstArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCurationProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileFindFirstOrThrowArgs} args - Arguments to find a UserCurationProfile
     * @example
     * // Get one UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCurationProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserCurationProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserCurationProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCurationProfiles
     * const userCurationProfiles = await prisma.userCurationProfile.findMany()
     * 
     * // Get first 10 UserCurationProfiles
     * const userCurationProfiles = await prisma.userCurationProfile.findMany({ take: 10 })
     * 
     * // Only select the `profile_id`
     * const userCurationProfileWithProfile_idOnly = await prisma.userCurationProfile.findMany({ select: { profile_id: true } })
     * 
     */
    findMany<T extends UserCurationProfileFindManyArgs>(args?: SelectSubset<T, UserCurationProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserCurationProfile.
     * @param {UserCurationProfileCreateArgs} args - Arguments to create a UserCurationProfile.
     * @example
     * // Create one UserCurationProfile
     * const UserCurationProfile = await prisma.userCurationProfile.create({
     *   data: {
     *     // ... data to create a UserCurationProfile
     *   }
     * })
     * 
     */
    create<T extends UserCurationProfileCreateArgs>(args: SelectSubset<T, UserCurationProfileCreateArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserCurationProfiles.
     * @param {UserCurationProfileCreateManyArgs} args - Arguments to create many UserCurationProfiles.
     * @example
     * // Create many UserCurationProfiles
     * const userCurationProfile = await prisma.userCurationProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCurationProfileCreateManyArgs>(args?: SelectSubset<T, UserCurationProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserCurationProfiles and returns the data saved in the database.
     * @param {UserCurationProfileCreateManyAndReturnArgs} args - Arguments to create many UserCurationProfiles.
     * @example
     * // Create many UserCurationProfiles
     * const userCurationProfile = await prisma.userCurationProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserCurationProfiles and only return the `profile_id`
     * const userCurationProfileWithProfile_idOnly = await prisma.userCurationProfile.createManyAndReturn({
     *   select: { profile_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCurationProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCurationProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserCurationProfile.
     * @param {UserCurationProfileDeleteArgs} args - Arguments to delete one UserCurationProfile.
     * @example
     * // Delete one UserCurationProfile
     * const UserCurationProfile = await prisma.userCurationProfile.delete({
     *   where: {
     *     // ... filter to delete one UserCurationProfile
     *   }
     * })
     * 
     */
    delete<T extends UserCurationProfileDeleteArgs>(args: SelectSubset<T, UserCurationProfileDeleteArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserCurationProfile.
     * @param {UserCurationProfileUpdateArgs} args - Arguments to update one UserCurationProfile.
     * @example
     * // Update one UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserCurationProfileUpdateArgs>(args: SelectSubset<T, UserCurationProfileUpdateArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserCurationProfiles.
     * @param {UserCurationProfileDeleteManyArgs} args - Arguments to filter UserCurationProfiles to delete.
     * @example
     * // Delete a few UserCurationProfiles
     * const { count } = await prisma.userCurationProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserCurationProfileDeleteManyArgs>(args?: SelectSubset<T, UserCurationProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCurationProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCurationProfiles
     * const userCurationProfile = await prisma.userCurationProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserCurationProfileUpdateManyArgs>(args: SelectSubset<T, UserCurationProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCurationProfiles and returns the data updated in the database.
     * @param {UserCurationProfileUpdateManyAndReturnArgs} args - Arguments to update many UserCurationProfiles.
     * @example
     * // Update many UserCurationProfiles
     * const userCurationProfile = await prisma.userCurationProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserCurationProfiles and only return the `profile_id`
     * const userCurationProfileWithProfile_idOnly = await prisma.userCurationProfile.updateManyAndReturn({
     *   select: { profile_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserCurationProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserCurationProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserCurationProfile.
     * @param {UserCurationProfileUpsertArgs} args - Arguments to update or create a UserCurationProfile.
     * @example
     * // Update or create a UserCurationProfile
     * const userCurationProfile = await prisma.userCurationProfile.upsert({
     *   create: {
     *     // ... data to create a UserCurationProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCurationProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserCurationProfileUpsertArgs>(args: SelectSubset<T, UserCurationProfileUpsertArgs<ExtArgs>>): Prisma__UserCurationProfileClient<$Result.GetResult<Prisma.$UserCurationProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserCurationProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileCountArgs} args - Arguments to filter UserCurationProfiles to count.
     * @example
     * // Count the number of UserCurationProfiles
     * const count = await prisma.userCurationProfile.count({
     *   where: {
     *     // ... the filter for the UserCurationProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserCurationProfileCountArgs>(
      args?: Subset<T, UserCurationProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCurationProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCurationProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserCurationProfileAggregateArgs>(args: Subset<T, UserCurationProfileAggregateArgs>): Prisma.PrismaPromise<GetUserCurationProfileAggregateType<T>>

    /**
     * Group by UserCurationProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCurationProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserCurationProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCurationProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserCurationProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserCurationProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCurationProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserCurationProfile model
   */
  readonly fields: UserCurationProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCurationProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserCurationProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    episode<T extends UserCurationProfile$episodeArgs<ExtArgs> = {}>(args?: Subset<T, UserCurationProfile$episodeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EpisodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profile_podcast<T extends UserCurationProfile$profile_podcastArgs<ExtArgs> = {}>(args?: Subset<T, UserCurationProfile$profile_podcastArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePodcastPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bundle<T extends UserCurationProfile$bundleArgs<ExtArgs> = {}>(args?: Subset<T, UserCurationProfile$bundleArgs<ExtArgs>>): Prisma__BundleClient<$Result.GetResult<Prisma.$BundlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserCurationProfile model
   */
  interface UserCurationProfileFieldRefs {
    readonly profile_id: FieldRef<"UserCurationProfile", 'String'>
    readonly user_id: FieldRef<"UserCurationProfile", 'String'>
    readonly name: FieldRef<"UserCurationProfile", 'String'>
    readonly status: FieldRef<"UserCurationProfile", 'String'>
    readonly audio_url: FieldRef<"UserCurationProfile", 'String'>
    readonly image_url: FieldRef<"UserCurationProfile", 'String'>
    readonly created_at: FieldRef<"UserCurationProfile", 'DateTime'>
    readonly updated_at: FieldRef<"UserCurationProfile", 'DateTime'>
    readonly generated_at: FieldRef<"UserCurationProfile", 'DateTime'>
    readonly last_generation_date: FieldRef<"UserCurationProfile", 'DateTime'>
    readonly next_generation_date: FieldRef<"UserCurationProfile", 'DateTime'>
    readonly is_active: FieldRef<"UserCurationProfile", 'Boolean'>
    readonly is_bundle_selection: FieldRef<"UserCurationProfile", 'Boolean'>
    readonly selected_bundle_id: FieldRef<"UserCurationProfile", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserCurationProfile findUnique
   */
  export type UserCurationProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserCurationProfile to fetch.
     */
    where: UserCurationProfileWhereUniqueInput
  }

  /**
   * UserCurationProfile findUniqueOrThrow
   */
  export type UserCurationProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserCurationProfile to fetch.
     */
    where: UserCurationProfileWhereUniqueInput
  }

  /**
   * UserCurationProfile findFirst
   */
  export type UserCurationProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserCurationProfile to fetch.
     */
    where?: UserCurationProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCurationProfiles to fetch.
     */
    orderBy?: UserCurationProfileOrderByWithRelationInput | UserCurationProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCurationProfiles.
     */
    cursor?: UserCurationProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCurationProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCurationProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCurationProfiles.
     */
    distinct?: UserCurationProfileScalarFieldEnum | UserCurationProfileScalarFieldEnum[]
  }

  /**
   * UserCurationProfile findFirstOrThrow
   */
  export type UserCurationProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserCurationProfile to fetch.
     */
    where?: UserCurationProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCurationProfiles to fetch.
     */
    orderBy?: UserCurationProfileOrderByWithRelationInput | UserCurationProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCurationProfiles.
     */
    cursor?: UserCurationProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCurationProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCurationProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCurationProfiles.
     */
    distinct?: UserCurationProfileScalarFieldEnum | UserCurationProfileScalarFieldEnum[]
  }

  /**
   * UserCurationProfile findMany
   */
  export type UserCurationProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserCurationProfiles to fetch.
     */
    where?: UserCurationProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCurationProfiles to fetch.
     */
    orderBy?: UserCurationProfileOrderByWithRelationInput | UserCurationProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCurationProfiles.
     */
    cursor?: UserCurationProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCurationProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCurationProfiles.
     */
    skip?: number
    distinct?: UserCurationProfileScalarFieldEnum | UserCurationProfileScalarFieldEnum[]
  }

  /**
   * UserCurationProfile create
   */
  export type UserCurationProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserCurationProfile.
     */
    data: XOR<UserCurationProfileCreateInput, UserCurationProfileUncheckedCreateInput>
  }

  /**
   * UserCurationProfile createMany
   */
  export type UserCurationProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCurationProfiles.
     */
    data: UserCurationProfileCreateManyInput | UserCurationProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserCurationProfile createManyAndReturn
   */
  export type UserCurationProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserCurationProfiles.
     */
    data: UserCurationProfileCreateManyInput | UserCurationProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCurationProfile update
   */
  export type UserCurationProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserCurationProfile.
     */
    data: XOR<UserCurationProfileUpdateInput, UserCurationProfileUncheckedUpdateInput>
    /**
     * Choose, which UserCurationProfile to update.
     */
    where: UserCurationProfileWhereUniqueInput
  }

  /**
   * UserCurationProfile updateMany
   */
  export type UserCurationProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCurationProfiles.
     */
    data: XOR<UserCurationProfileUpdateManyMutationInput, UserCurationProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserCurationProfiles to update
     */
    where?: UserCurationProfileWhereInput
    /**
     * Limit how many UserCurationProfiles to update.
     */
    limit?: number
  }

  /**
   * UserCurationProfile updateManyAndReturn
   */
  export type UserCurationProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserCurationProfiles.
     */
    data: XOR<UserCurationProfileUpdateManyMutationInput, UserCurationProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserCurationProfiles to update
     */
    where?: UserCurationProfileWhereInput
    /**
     * Limit how many UserCurationProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCurationProfile upsert
   */
  export type UserCurationProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserCurationProfile to update in case it exists.
     */
    where: UserCurationProfileWhereUniqueInput
    /**
     * In case the UserCurationProfile found by the `where` argument doesn't exist, create a new UserCurationProfile with this data.
     */
    create: XOR<UserCurationProfileCreateInput, UserCurationProfileUncheckedCreateInput>
    /**
     * In case the UserCurationProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCurationProfileUpdateInput, UserCurationProfileUncheckedUpdateInput>
  }

  /**
   * UserCurationProfile delete
   */
  export type UserCurationProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
    /**
     * Filter which UserCurationProfile to delete.
     */
    where: UserCurationProfileWhereUniqueInput
  }

  /**
   * UserCurationProfile deleteMany
   */
  export type UserCurationProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCurationProfiles to delete
     */
    where?: UserCurationProfileWhereInput
    /**
     * Limit how many UserCurationProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserCurationProfile.episode
   */
  export type UserCurationProfile$episodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Episode
     */
    select?: EpisodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Episode
     */
    omit?: EpisodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EpisodeInclude<ExtArgs> | null
    where?: EpisodeWhereInput
    orderBy?: EpisodeOrderByWithRelationInput | EpisodeOrderByWithRelationInput[]
    cursor?: EpisodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EpisodeScalarFieldEnum | EpisodeScalarFieldEnum[]
  }

  /**
   * UserCurationProfile.profile_podcast
   */
  export type UserCurationProfile$profile_podcastArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilePodcast
     */
    select?: ProfilePodcastSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfilePodcast
     */
    omit?: ProfilePodcastOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfilePodcastInclude<ExtArgs> | null
    where?: ProfilePodcastWhereInput
    orderBy?: ProfilePodcastOrderByWithRelationInput | ProfilePodcastOrderByWithRelationInput[]
    cursor?: ProfilePodcastWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfilePodcastScalarFieldEnum | ProfilePodcastScalarFieldEnum[]
  }

  /**
   * UserCurationProfile.bundle
   */
  export type UserCurationProfile$bundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bundle
     */
    select?: BundleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bundle
     */
    omit?: BundleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BundleInclude<ExtArgs> | null
    where?: BundleWhereInput
  }

  /**
   * UserCurationProfile without action
   */
  export type UserCurationProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCurationProfile
     */
    select?: UserCurationProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCurationProfile
     */
    omit?: UserCurationProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCurationProfileInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EpisodeFeedbackScalarFieldEnum: {
    feedback_id: 'feedback_id',
    userId: 'userId',
    episodeId: 'episodeId',
    rating: 'rating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EpisodeFeedbackScalarFieldEnum = (typeof EpisodeFeedbackScalarFieldEnum)[keyof typeof EpisodeFeedbackScalarFieldEnum]


  export const BundleScalarFieldEnum: {
    bundle_id: 'bundle_id',
    name: 'name',
    description: 'description',
    image_url: 'image_url',
    is_static: 'is_static',
    is_active: 'is_active',
    owner_user_id: 'owner_user_id',
    created_at: 'created_at'
  };

  export type BundleScalarFieldEnum = (typeof BundleScalarFieldEnum)[keyof typeof BundleScalarFieldEnum]


  export const BundlePodcastScalarFieldEnum: {
    bundle_id: 'bundle_id',
    podcast_id: 'podcast_id'
  };

  export type BundlePodcastScalarFieldEnum = (typeof BundlePodcastScalarFieldEnum)[keyof typeof BundlePodcastScalarFieldEnum]


  export const EpisodeScalarFieldEnum: {
    episode_id: 'episode_id',
    podcast_id: 'podcast_id',
    profile_id: 'profile_id',
    bundle_id: 'bundle_id',
    title: 'title',
    description: 'description',
    audio_url: 'audio_url',
    image_url: 'image_url',
    published_at: 'published_at',
    week_nr: 'week_nr',
    created_at: 'created_at'
  };

  export type EpisodeScalarFieldEnum = (typeof EpisodeScalarFieldEnum)[keyof typeof EpisodeScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    notification_id: 'notification_id',
    user_id: 'user_id',
    type: 'type',
    message: 'message',
    is_read: 'is_read',
    created_at: 'created_at'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const PodcastScalarFieldEnum: {
    podcast_id: 'podcast_id',
    name: 'name',
    description: 'description',
    url: 'url',
    image_url: 'image_url',
    category: 'category',
    is_active: 'is_active',
    owner_user_id: 'owner_user_id',
    created_at: 'created_at'
  };

  export type PodcastScalarFieldEnum = (typeof PodcastScalarFieldEnum)[keyof typeof PodcastScalarFieldEnum]


  export const ProfilePodcastScalarFieldEnum: {
    profile_id: 'profile_id',
    podcast_id: 'podcast_id'
  };

  export type ProfilePodcastScalarFieldEnum = (typeof ProfilePodcastScalarFieldEnum)[keyof typeof ProfilePodcastScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    subscription_id: 'subscription_id',
    user_id: 'user_id',
    link_customer_id: 'link_customer_id',
    link_subscription_id: 'link_subscription_id',
    link_price_id: 'link_price_id',
    status: 'status',
    current_period_start: 'current_period_start',
    current_period_end: 'current_period_end',
    trail_start: 'trail_start',
    trial_end: 'trial_end',
    canceled_at: 'canceled_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    user_id: 'user_id',
    name: 'name',
    email: 'email',
    password: 'password',
    image: 'image',
    email_verified: 'email_verified',
    is_admin: 'is_admin',
    email_notifications: 'email_notifications',
    in_app_notifications: 'in_app_notifications',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserCurationProfileScalarFieldEnum: {
    profile_id: 'profile_id',
    user_id: 'user_id',
    name: 'name',
    status: 'status',
    audio_url: 'audio_url',
    image_url: 'image_url',
    created_at: 'created_at',
    updated_at: 'updated_at',
    generated_at: 'generated_at',
    last_generation_date: 'last_generation_date',
    next_generation_date: 'next_generation_date',
    is_active: 'is_active',
    is_bundle_selection: 'is_bundle_selection',
    selected_bundle_id: 'selected_bundle_id'
  };

  export type UserCurationProfileScalarFieldEnum = (typeof UserCurationProfileScalarFieldEnum)[keyof typeof UserCurationProfileScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'FeedbackRating'
   */
  export type EnumFeedbackRatingFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackRating'>
    


  /**
   * Reference to a field of type 'FeedbackRating[]'
   */
  export type ListEnumFeedbackRatingFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackRating[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type EpisodeFeedbackWhereInput = {
    AND?: EpisodeFeedbackWhereInput | EpisodeFeedbackWhereInput[]
    OR?: EpisodeFeedbackWhereInput[]
    NOT?: EpisodeFeedbackWhereInput | EpisodeFeedbackWhereInput[]
    feedback_id?: StringFilter<"EpisodeFeedback"> | string
    userId?: StringFilter<"EpisodeFeedback"> | string
    episodeId?: StringFilter<"EpisodeFeedback"> | string
    rating?: EnumFeedbackRatingFilter<"EpisodeFeedback"> | $Enums.FeedbackRating
    createdAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
    episode?: XOR<EpisodeScalarRelationFilter, EpisodeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EpisodeFeedbackOrderByWithRelationInput = {
    feedback_id?: SortOrder
    userId?: SortOrder
    episodeId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    episode?: EpisodeOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type EpisodeFeedbackWhereUniqueInput = Prisma.AtLeast<{
    feedback_id?: string
    userId_episodeId?: EpisodeFeedbackUserIdEpisodeIdCompoundUniqueInput
    AND?: EpisodeFeedbackWhereInput | EpisodeFeedbackWhereInput[]
    OR?: EpisodeFeedbackWhereInput[]
    NOT?: EpisodeFeedbackWhereInput | EpisodeFeedbackWhereInput[]
    userId?: StringFilter<"EpisodeFeedback"> | string
    episodeId?: StringFilter<"EpisodeFeedback"> | string
    rating?: EnumFeedbackRatingFilter<"EpisodeFeedback"> | $Enums.FeedbackRating
    createdAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
    episode?: XOR<EpisodeScalarRelationFilter, EpisodeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "feedback_id" | "userId_episodeId">

  export type EpisodeFeedbackOrderByWithAggregationInput = {
    feedback_id?: SortOrder
    userId?: SortOrder
    episodeId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EpisodeFeedbackCountOrderByAggregateInput
    _max?: EpisodeFeedbackMaxOrderByAggregateInput
    _min?: EpisodeFeedbackMinOrderByAggregateInput
  }

  export type EpisodeFeedbackScalarWhereWithAggregatesInput = {
    AND?: EpisodeFeedbackScalarWhereWithAggregatesInput | EpisodeFeedbackScalarWhereWithAggregatesInput[]
    OR?: EpisodeFeedbackScalarWhereWithAggregatesInput[]
    NOT?: EpisodeFeedbackScalarWhereWithAggregatesInput | EpisodeFeedbackScalarWhereWithAggregatesInput[]
    feedback_id?: StringWithAggregatesFilter<"EpisodeFeedback"> | string
    userId?: StringWithAggregatesFilter<"EpisodeFeedback"> | string
    episodeId?: StringWithAggregatesFilter<"EpisodeFeedback"> | string
    rating?: EnumFeedbackRatingWithAggregatesFilter<"EpisodeFeedback"> | $Enums.FeedbackRating
    createdAt?: DateTimeWithAggregatesFilter<"EpisodeFeedback"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EpisodeFeedback"> | Date | string
  }

  export type BundleWhereInput = {
    AND?: BundleWhereInput | BundleWhereInput[]
    OR?: BundleWhereInput[]
    NOT?: BundleWhereInput | BundleWhereInput[]
    bundle_id?: StringFilter<"Bundle"> | string
    name?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    image_url?: StringNullableFilter<"Bundle"> | string | null
    is_static?: BoolFilter<"Bundle"> | boolean
    is_active?: BoolFilter<"Bundle"> | boolean
    owner_user_id?: StringNullableFilter<"Bundle"> | string | null
    created_at?: DateTimeFilter<"Bundle"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    bundle_podcast?: BundlePodcastListRelationFilter
    episode?: EpisodeListRelationFilter
    user_curation_profile?: UserCurationProfileListRelationFilter
  }

  export type BundleOrderByWithRelationInput = {
    bundle_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    is_static?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
    bundle_podcast?: BundlePodcastOrderByRelationAggregateInput
    episode?: EpisodeOrderByRelationAggregateInput
    user_curation_profile?: UserCurationProfileOrderByRelationAggregateInput
  }

  export type BundleWhereUniqueInput = Prisma.AtLeast<{
    bundle_id?: string
    AND?: BundleWhereInput | BundleWhereInput[]
    OR?: BundleWhereInput[]
    NOT?: BundleWhereInput | BundleWhereInput[]
    name?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    image_url?: StringNullableFilter<"Bundle"> | string | null
    is_static?: BoolFilter<"Bundle"> | boolean
    is_active?: BoolFilter<"Bundle"> | boolean
    owner_user_id?: StringNullableFilter<"Bundle"> | string | null
    created_at?: DateTimeFilter<"Bundle"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    bundle_podcast?: BundlePodcastListRelationFilter
    episode?: EpisodeListRelationFilter
    user_curation_profile?: UserCurationProfileListRelationFilter
  }, "bundle_id">

  export type BundleOrderByWithAggregationInput = {
    bundle_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    is_static?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: BundleCountOrderByAggregateInput
    _max?: BundleMaxOrderByAggregateInput
    _min?: BundleMinOrderByAggregateInput
  }

  export type BundleScalarWhereWithAggregatesInput = {
    AND?: BundleScalarWhereWithAggregatesInput | BundleScalarWhereWithAggregatesInput[]
    OR?: BundleScalarWhereWithAggregatesInput[]
    NOT?: BundleScalarWhereWithAggregatesInput | BundleScalarWhereWithAggregatesInput[]
    bundle_id?: StringWithAggregatesFilter<"Bundle"> | string
    name?: StringWithAggregatesFilter<"Bundle"> | string
    description?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    image_url?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    is_static?: BoolWithAggregatesFilter<"Bundle"> | boolean
    is_active?: BoolWithAggregatesFilter<"Bundle"> | boolean
    owner_user_id?: StringNullableWithAggregatesFilter<"Bundle"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Bundle"> | Date | string
  }

  export type BundlePodcastWhereInput = {
    AND?: BundlePodcastWhereInput | BundlePodcastWhereInput[]
    OR?: BundlePodcastWhereInput[]
    NOT?: BundlePodcastWhereInput | BundlePodcastWhereInput[]
    bundle_id?: StringFilter<"BundlePodcast"> | string
    podcast_id?: StringFilter<"BundlePodcast"> | string
    bundle?: XOR<BundleScalarRelationFilter, BundleWhereInput>
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
  }

  export type BundlePodcastOrderByWithRelationInput = {
    bundle_id?: SortOrder
    podcast_id?: SortOrder
    bundle?: BundleOrderByWithRelationInput
    podcast?: PodcastOrderByWithRelationInput
  }

  export type BundlePodcastWhereUniqueInput = Prisma.AtLeast<{
    bundle_id_podcast_id?: BundlePodcastBundle_idPodcast_idCompoundUniqueInput
    AND?: BundlePodcastWhereInput | BundlePodcastWhereInput[]
    OR?: BundlePodcastWhereInput[]
    NOT?: BundlePodcastWhereInput | BundlePodcastWhereInput[]
    bundle_id?: StringFilter<"BundlePodcast"> | string
    podcast_id?: StringFilter<"BundlePodcast"> | string
    bundle?: XOR<BundleScalarRelationFilter, BundleWhereInput>
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
  }, "bundle_id_podcast_id">

  export type BundlePodcastOrderByWithAggregationInput = {
    bundle_id?: SortOrder
    podcast_id?: SortOrder
    _count?: BundlePodcastCountOrderByAggregateInput
    _max?: BundlePodcastMaxOrderByAggregateInput
    _min?: BundlePodcastMinOrderByAggregateInput
  }

  export type BundlePodcastScalarWhereWithAggregatesInput = {
    AND?: BundlePodcastScalarWhereWithAggregatesInput | BundlePodcastScalarWhereWithAggregatesInput[]
    OR?: BundlePodcastScalarWhereWithAggregatesInput[]
    NOT?: BundlePodcastScalarWhereWithAggregatesInput | BundlePodcastScalarWhereWithAggregatesInput[]
    bundle_id?: StringWithAggregatesFilter<"BundlePodcast"> | string
    podcast_id?: StringWithAggregatesFilter<"BundlePodcast"> | string
  }

  export type EpisodeWhereInput = {
    AND?: EpisodeWhereInput | EpisodeWhereInput[]
    OR?: EpisodeWhereInput[]
    NOT?: EpisodeWhereInput | EpisodeWhereInput[]
    episode_id?: StringFilter<"Episode"> | string
    podcast_id?: StringFilter<"Episode"> | string
    profile_id?: StringNullableFilter<"Episode"> | string | null
    bundle_id?: StringNullableFilter<"Episode"> | string | null
    title?: StringFilter<"Episode"> | string
    description?: StringNullableFilter<"Episode"> | string | null
    audio_url?: StringFilter<"Episode"> | string
    image_url?: StringNullableFilter<"Episode"> | string | null
    published_at?: DateTimeNullableFilter<"Episode"> | Date | string | null
    week_nr?: DateTimeNullableFilter<"Episode"> | Date | string | null
    created_at?: DateTimeFilter<"Episode"> | Date | string
    bundle?: XOR<BundleNullableScalarRelationFilter, BundleWhereInput> | null
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
    user_curation_profile?: XOR<UserCurationProfileNullableScalarRelationFilter, UserCurationProfileWhereInput> | null
    feedback?: EpisodeFeedbackListRelationFilter
  }

  export type EpisodeOrderByWithRelationInput = {
    episode_id?: SortOrder
    podcast_id?: SortOrder
    profile_id?: SortOrderInput | SortOrder
    bundle_id?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    audio_url?: SortOrder
    image_url?: SortOrderInput | SortOrder
    published_at?: SortOrderInput | SortOrder
    week_nr?: SortOrderInput | SortOrder
    created_at?: SortOrder
    bundle?: BundleOrderByWithRelationInput
    podcast?: PodcastOrderByWithRelationInput
    user_curation_profile?: UserCurationProfileOrderByWithRelationInput
    feedback?: EpisodeFeedbackOrderByRelationAggregateInput
  }

  export type EpisodeWhereUniqueInput = Prisma.AtLeast<{
    episode_id?: string
    AND?: EpisodeWhereInput | EpisodeWhereInput[]
    OR?: EpisodeWhereInput[]
    NOT?: EpisodeWhereInput | EpisodeWhereInput[]
    podcast_id?: StringFilter<"Episode"> | string
    profile_id?: StringNullableFilter<"Episode"> | string | null
    bundle_id?: StringNullableFilter<"Episode"> | string | null
    title?: StringFilter<"Episode"> | string
    description?: StringNullableFilter<"Episode"> | string | null
    audio_url?: StringFilter<"Episode"> | string
    image_url?: StringNullableFilter<"Episode"> | string | null
    published_at?: DateTimeNullableFilter<"Episode"> | Date | string | null
    week_nr?: DateTimeNullableFilter<"Episode"> | Date | string | null
    created_at?: DateTimeFilter<"Episode"> | Date | string
    bundle?: XOR<BundleNullableScalarRelationFilter, BundleWhereInput> | null
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
    user_curation_profile?: XOR<UserCurationProfileNullableScalarRelationFilter, UserCurationProfileWhereInput> | null
    feedback?: EpisodeFeedbackListRelationFilter
  }, "episode_id">

  export type EpisodeOrderByWithAggregationInput = {
    episode_id?: SortOrder
    podcast_id?: SortOrder
    profile_id?: SortOrderInput | SortOrder
    bundle_id?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    audio_url?: SortOrder
    image_url?: SortOrderInput | SortOrder
    published_at?: SortOrderInput | SortOrder
    week_nr?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: EpisodeCountOrderByAggregateInput
    _max?: EpisodeMaxOrderByAggregateInput
    _min?: EpisodeMinOrderByAggregateInput
  }

  export type EpisodeScalarWhereWithAggregatesInput = {
    AND?: EpisodeScalarWhereWithAggregatesInput | EpisodeScalarWhereWithAggregatesInput[]
    OR?: EpisodeScalarWhereWithAggregatesInput[]
    NOT?: EpisodeScalarWhereWithAggregatesInput | EpisodeScalarWhereWithAggregatesInput[]
    episode_id?: StringWithAggregatesFilter<"Episode"> | string
    podcast_id?: StringWithAggregatesFilter<"Episode"> | string
    profile_id?: StringNullableWithAggregatesFilter<"Episode"> | string | null
    bundle_id?: StringNullableWithAggregatesFilter<"Episode"> | string | null
    title?: StringWithAggregatesFilter<"Episode"> | string
    description?: StringNullableWithAggregatesFilter<"Episode"> | string | null
    audio_url?: StringWithAggregatesFilter<"Episode"> | string
    image_url?: StringNullableWithAggregatesFilter<"Episode"> | string | null
    published_at?: DateTimeNullableWithAggregatesFilter<"Episode"> | Date | string | null
    week_nr?: DateTimeNullableWithAggregatesFilter<"Episode"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Episode"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    notification_id?: StringFilter<"Notification"> | string
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    notification_id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "notification_id">

  export type NotificationOrderByWithAggregationInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    notification_id?: StringWithAggregatesFilter<"Notification"> | string
    user_id?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    is_read?: BoolWithAggregatesFilter<"Notification"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type PodcastWhereInput = {
    AND?: PodcastWhereInput | PodcastWhereInput[]
    OR?: PodcastWhereInput[]
    NOT?: PodcastWhereInput | PodcastWhereInput[]
    podcast_id?: StringFilter<"Podcast"> | string
    name?: StringFilter<"Podcast"> | string
    description?: StringNullableFilter<"Podcast"> | string | null
    url?: StringFilter<"Podcast"> | string
    image_url?: StringNullableFilter<"Podcast"> | string | null
    category?: StringNullableFilter<"Podcast"> | string | null
    is_active?: BoolFilter<"Podcast"> | boolean
    owner_user_id?: StringNullableFilter<"Podcast"> | string | null
    created_at?: DateTimeFilter<"Podcast"> | Date | string
    bundle_podcast?: BundlePodcastListRelationFilter
    episode?: EpisodeListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    profile_podcast?: ProfilePodcastListRelationFilter
  }

  export type PodcastOrderByWithRelationInput = {
    podcast_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    url?: SortOrder
    image_url?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    bundle_podcast?: BundlePodcastOrderByRelationAggregateInput
    episode?: EpisodeOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    profile_podcast?: ProfilePodcastOrderByRelationAggregateInput
  }

  export type PodcastWhereUniqueInput = Prisma.AtLeast<{
    podcast_id?: string
    url?: string
    AND?: PodcastWhereInput | PodcastWhereInput[]
    OR?: PodcastWhereInput[]
    NOT?: PodcastWhereInput | PodcastWhereInput[]
    name?: StringFilter<"Podcast"> | string
    description?: StringNullableFilter<"Podcast"> | string | null
    image_url?: StringNullableFilter<"Podcast"> | string | null
    category?: StringNullableFilter<"Podcast"> | string | null
    is_active?: BoolFilter<"Podcast"> | boolean
    owner_user_id?: StringNullableFilter<"Podcast"> | string | null
    created_at?: DateTimeFilter<"Podcast"> | Date | string
    bundle_podcast?: BundlePodcastListRelationFilter
    episode?: EpisodeListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    profile_podcast?: ProfilePodcastListRelationFilter
  }, "podcast_id" | "url">

  export type PodcastOrderByWithAggregationInput = {
    podcast_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    url?: SortOrder
    image_url?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: PodcastCountOrderByAggregateInput
    _max?: PodcastMaxOrderByAggregateInput
    _min?: PodcastMinOrderByAggregateInput
  }

  export type PodcastScalarWhereWithAggregatesInput = {
    AND?: PodcastScalarWhereWithAggregatesInput | PodcastScalarWhereWithAggregatesInput[]
    OR?: PodcastScalarWhereWithAggregatesInput[]
    NOT?: PodcastScalarWhereWithAggregatesInput | PodcastScalarWhereWithAggregatesInput[]
    podcast_id?: StringWithAggregatesFilter<"Podcast"> | string
    name?: StringWithAggregatesFilter<"Podcast"> | string
    description?: StringNullableWithAggregatesFilter<"Podcast"> | string | null
    url?: StringWithAggregatesFilter<"Podcast"> | string
    image_url?: StringNullableWithAggregatesFilter<"Podcast"> | string | null
    category?: StringNullableWithAggregatesFilter<"Podcast"> | string | null
    is_active?: BoolWithAggregatesFilter<"Podcast"> | boolean
    owner_user_id?: StringNullableWithAggregatesFilter<"Podcast"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Podcast"> | Date | string
  }

  export type ProfilePodcastWhereInput = {
    AND?: ProfilePodcastWhereInput | ProfilePodcastWhereInput[]
    OR?: ProfilePodcastWhereInput[]
    NOT?: ProfilePodcastWhereInput | ProfilePodcastWhereInput[]
    profile_id?: StringFilter<"ProfilePodcast"> | string
    podcast_id?: StringFilter<"ProfilePodcast"> | string
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
    user_curation_profile?: XOR<UserCurationProfileScalarRelationFilter, UserCurationProfileWhereInput>
  }

  export type ProfilePodcastOrderByWithRelationInput = {
    profile_id?: SortOrder
    podcast_id?: SortOrder
    podcast?: PodcastOrderByWithRelationInput
    user_curation_profile?: UserCurationProfileOrderByWithRelationInput
  }

  export type ProfilePodcastWhereUniqueInput = Prisma.AtLeast<{
    profile_id_podcast_id?: ProfilePodcastProfile_idPodcast_idCompoundUniqueInput
    AND?: ProfilePodcastWhereInput | ProfilePodcastWhereInput[]
    OR?: ProfilePodcastWhereInput[]
    NOT?: ProfilePodcastWhereInput | ProfilePodcastWhereInput[]
    profile_id?: StringFilter<"ProfilePodcast"> | string
    podcast_id?: StringFilter<"ProfilePodcast"> | string
    podcast?: XOR<PodcastScalarRelationFilter, PodcastWhereInput>
    user_curation_profile?: XOR<UserCurationProfileScalarRelationFilter, UserCurationProfileWhereInput>
  }, "profile_id_podcast_id">

  export type ProfilePodcastOrderByWithAggregationInput = {
    profile_id?: SortOrder
    podcast_id?: SortOrder
    _count?: ProfilePodcastCountOrderByAggregateInput
    _max?: ProfilePodcastMaxOrderByAggregateInput
    _min?: ProfilePodcastMinOrderByAggregateInput
  }

  export type ProfilePodcastScalarWhereWithAggregatesInput = {
    AND?: ProfilePodcastScalarWhereWithAggregatesInput | ProfilePodcastScalarWhereWithAggregatesInput[]
    OR?: ProfilePodcastScalarWhereWithAggregatesInput[]
    NOT?: ProfilePodcastScalarWhereWithAggregatesInput | ProfilePodcastScalarWhereWithAggregatesInput[]
    profile_id?: StringWithAggregatesFilter<"ProfilePodcast"> | string
    podcast_id?: StringWithAggregatesFilter<"ProfilePodcast"> | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    subscription_id?: StringFilter<"Subscription"> | string
    user_id?: StringFilter<"Subscription"> | string
    link_customer_id?: StringNullableFilter<"Subscription"> | string | null
    link_subscription_id?: StringNullableFilter<"Subscription"> | string | null
    link_price_id?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    current_period_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    current_period_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trail_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trial_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    canceled_at?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    created_at?: DateTimeFilter<"Subscription"> | Date | string
    updated_at?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    subscription_id?: SortOrder
    user_id?: SortOrder
    link_customer_id?: SortOrderInput | SortOrder
    link_subscription_id?: SortOrderInput | SortOrder
    link_price_id?: SortOrderInput | SortOrder
    status?: SortOrder
    current_period_start?: SortOrderInput | SortOrder
    current_period_end?: SortOrderInput | SortOrder
    trail_start?: SortOrderInput | SortOrder
    trial_end?: SortOrderInput | SortOrder
    canceled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    subscription_id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    user_id?: StringFilter<"Subscription"> | string
    link_customer_id?: StringNullableFilter<"Subscription"> | string | null
    link_subscription_id?: StringNullableFilter<"Subscription"> | string | null
    link_price_id?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    current_period_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    current_period_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trail_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trial_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    canceled_at?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    created_at?: DateTimeFilter<"Subscription"> | Date | string
    updated_at?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "subscription_id">

  export type SubscriptionOrderByWithAggregationInput = {
    subscription_id?: SortOrder
    user_id?: SortOrder
    link_customer_id?: SortOrderInput | SortOrder
    link_subscription_id?: SortOrderInput | SortOrder
    link_price_id?: SortOrderInput | SortOrder
    status?: SortOrder
    current_period_start?: SortOrderInput | SortOrder
    current_period_end?: SortOrderInput | SortOrder
    trail_start?: SortOrderInput | SortOrder
    trial_end?: SortOrderInput | SortOrder
    canceled_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    subscription_id?: StringWithAggregatesFilter<"Subscription"> | string
    user_id?: StringWithAggregatesFilter<"Subscription"> | string
    link_customer_id?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    link_subscription_id?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    link_price_id?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
    current_period_start?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    current_period_end?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    trail_start?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    trial_end?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    canceled_at?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    user_id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    image?: StringNullableFilter<"User"> | string | null
    email_verified?: DateTimeNullableFilter<"User"> | Date | string | null
    is_admin?: BoolFilter<"User"> | boolean
    email_notifications?: BoolFilter<"User"> | boolean
    in_app_notifications?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    bundle?: BundleListRelationFilter
    feedback?: EpisodeFeedbackListRelationFilter
    notification?: NotificationListRelationFilter
    podcast?: PodcastListRelationFilter
    subscription?: SubscriptionListRelationFilter
    user_curation_profile?: XOR<UserCurationProfileNullableScalarRelationFilter, UserCurationProfileWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    user_id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrderInput | SortOrder
    email_verified?: SortOrderInput | SortOrder
    is_admin?: SortOrder
    email_notifications?: SortOrder
    in_app_notifications?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bundle?: BundleOrderByRelationAggregateInput
    feedback?: EpisodeFeedbackOrderByRelationAggregateInput
    notification?: NotificationOrderByRelationAggregateInput
    podcast?: PodcastOrderByRelationAggregateInput
    subscription?: SubscriptionOrderByRelationAggregateInput
    user_curation_profile?: UserCurationProfileOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    user_id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    image?: StringNullableFilter<"User"> | string | null
    email_verified?: DateTimeNullableFilter<"User"> | Date | string | null
    is_admin?: BoolFilter<"User"> | boolean
    email_notifications?: BoolFilter<"User"> | boolean
    in_app_notifications?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    bundle?: BundleListRelationFilter
    feedback?: EpisodeFeedbackListRelationFilter
    notification?: NotificationListRelationFilter
    podcast?: PodcastListRelationFilter
    subscription?: SubscriptionListRelationFilter
    user_curation_profile?: XOR<UserCurationProfileNullableScalarRelationFilter, UserCurationProfileWhereInput> | null
  }, "user_id" | "email">

  export type UserOrderByWithAggregationInput = {
    user_id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrderInput | SortOrder
    email_verified?: SortOrderInput | SortOrder
    is_admin?: SortOrder
    email_notifications?: SortOrder
    in_app_notifications?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    user_id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    email_verified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    is_admin?: BoolWithAggregatesFilter<"User"> | boolean
    email_notifications?: BoolWithAggregatesFilter<"User"> | boolean
    in_app_notifications?: BoolWithAggregatesFilter<"User"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserCurationProfileWhereInput = {
    AND?: UserCurationProfileWhereInput | UserCurationProfileWhereInput[]
    OR?: UserCurationProfileWhereInput[]
    NOT?: UserCurationProfileWhereInput | UserCurationProfileWhereInput[]
    profile_id?: StringFilter<"UserCurationProfile"> | string
    user_id?: StringFilter<"UserCurationProfile"> | string
    name?: StringFilter<"UserCurationProfile"> | string
    status?: StringFilter<"UserCurationProfile"> | string
    audio_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    image_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    created_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    updated_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    generated_at?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    last_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    next_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    is_active?: BoolFilter<"UserCurationProfile"> | boolean
    is_bundle_selection?: BoolFilter<"UserCurationProfile"> | boolean
    selected_bundle_id?: StringNullableFilter<"UserCurationProfile"> | string | null
    episode?: EpisodeListRelationFilter
    profile_podcast?: ProfilePodcastListRelationFilter
    bundle?: XOR<BundleNullableScalarRelationFilter, BundleWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserCurationProfileOrderByWithRelationInput = {
    profile_id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    audio_url?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    generated_at?: SortOrderInput | SortOrder
    last_generation_date?: SortOrderInput | SortOrder
    next_generation_date?: SortOrderInput | SortOrder
    is_active?: SortOrder
    is_bundle_selection?: SortOrder
    selected_bundle_id?: SortOrderInput | SortOrder
    episode?: EpisodeOrderByRelationAggregateInput
    profile_podcast?: ProfilePodcastOrderByRelationAggregateInput
    bundle?: BundleOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type UserCurationProfileWhereUniqueInput = Prisma.AtLeast<{
    profile_id?: string
    user_id?: string
    AND?: UserCurationProfileWhereInput | UserCurationProfileWhereInput[]
    OR?: UserCurationProfileWhereInput[]
    NOT?: UserCurationProfileWhereInput | UserCurationProfileWhereInput[]
    name?: StringFilter<"UserCurationProfile"> | string
    status?: StringFilter<"UserCurationProfile"> | string
    audio_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    image_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    created_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    updated_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    generated_at?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    last_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    next_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    is_active?: BoolFilter<"UserCurationProfile"> | boolean
    is_bundle_selection?: BoolFilter<"UserCurationProfile"> | boolean
    selected_bundle_id?: StringNullableFilter<"UserCurationProfile"> | string | null
    episode?: EpisodeListRelationFilter
    profile_podcast?: ProfilePodcastListRelationFilter
    bundle?: XOR<BundleNullableScalarRelationFilter, BundleWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "profile_id" | "user_id">

  export type UserCurationProfileOrderByWithAggregationInput = {
    profile_id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    audio_url?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    generated_at?: SortOrderInput | SortOrder
    last_generation_date?: SortOrderInput | SortOrder
    next_generation_date?: SortOrderInput | SortOrder
    is_active?: SortOrder
    is_bundle_selection?: SortOrder
    selected_bundle_id?: SortOrderInput | SortOrder
    _count?: UserCurationProfileCountOrderByAggregateInput
    _max?: UserCurationProfileMaxOrderByAggregateInput
    _min?: UserCurationProfileMinOrderByAggregateInput
  }

  export type UserCurationProfileScalarWhereWithAggregatesInput = {
    AND?: UserCurationProfileScalarWhereWithAggregatesInput | UserCurationProfileScalarWhereWithAggregatesInput[]
    OR?: UserCurationProfileScalarWhereWithAggregatesInput[]
    NOT?: UserCurationProfileScalarWhereWithAggregatesInput | UserCurationProfileScalarWhereWithAggregatesInput[]
    profile_id?: StringWithAggregatesFilter<"UserCurationProfile"> | string
    user_id?: StringWithAggregatesFilter<"UserCurationProfile"> | string
    name?: StringWithAggregatesFilter<"UserCurationProfile"> | string
    status?: StringWithAggregatesFilter<"UserCurationProfile"> | string
    audio_url?: StringNullableWithAggregatesFilter<"UserCurationProfile"> | string | null
    image_url?: StringNullableWithAggregatesFilter<"UserCurationProfile"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"UserCurationProfile"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"UserCurationProfile"> | Date | string
    generated_at?: DateTimeNullableWithAggregatesFilter<"UserCurationProfile"> | Date | string | null
    last_generation_date?: DateTimeNullableWithAggregatesFilter<"UserCurationProfile"> | Date | string | null
    next_generation_date?: DateTimeNullableWithAggregatesFilter<"UserCurationProfile"> | Date | string | null
    is_active?: BoolWithAggregatesFilter<"UserCurationProfile"> | boolean
    is_bundle_selection?: BoolWithAggregatesFilter<"UserCurationProfile"> | boolean
    selected_bundle_id?: StringNullableWithAggregatesFilter<"UserCurationProfile"> | string | null
  }

  export type EpisodeFeedbackCreateInput = {
    feedback_id: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
    episode: EpisodeCreateNestedOneWithoutFeedbackInput
    user: UserCreateNestedOneWithoutFeedbackInput
  }

  export type EpisodeFeedbackUncheckedCreateInput = {
    feedback_id: string
    userId: string
    episodeId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EpisodeFeedbackUpdateInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    episode?: EpisodeUpdateOneRequiredWithoutFeedbackNestedInput
    user?: UserUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type EpisodeFeedbackUncheckedUpdateInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    episodeId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeFeedbackCreateManyInput = {
    feedback_id: string
    userId: string
    episodeId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EpisodeFeedbackUpdateManyMutationInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeFeedbackUncheckedUpdateManyInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    episodeId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleCreateInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutBundleInput
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutBundleInput
    episode?: EpisodeCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutBundleInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleUpdateInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutBundleNestedInput
    bundle_podcast?: BundlePodcastUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type BundleCreateManyInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
  }

  export type BundleUpdateManyMutationInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundleUncheckedUpdateManyInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundlePodcastCreateInput = {
    bundle: BundleCreateNestedOneWithoutBundle_podcastInput
    podcast: PodcastCreateNestedOneWithoutBundle_podcastInput
  }

  export type BundlePodcastUncheckedCreateInput = {
    bundle_id: string
    podcast_id: string
  }

  export type BundlePodcastUpdateInput = {
    bundle?: BundleUpdateOneRequiredWithoutBundle_podcastNestedInput
    podcast?: PodcastUpdateOneRequiredWithoutBundle_podcastNestedInput
  }

  export type BundlePodcastUncheckedUpdateInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type BundlePodcastCreateManyInput = {
    bundle_id: string
    podcast_id: string
  }

  export type BundlePodcastUpdateManyMutationInput = {

  }

  export type BundlePodcastUncheckedUpdateManyInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type EpisodeCreateInput = {
    episode_id: string
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    bundle?: BundleCreateNestedOneWithoutEpisodeInput
    podcast: PodcastCreateNestedOneWithoutEpisodeInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutEpisodeInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeUncheckedCreateInput = {
    episode_id: string
    podcast_id: string
    profile_id?: string | null
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeUpdateInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneWithoutEpisodeNestedInput
    podcast?: PodcastUpdateOneRequiredWithoutEpisodeNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutEpisodeNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeCreateManyInput = {
    episode_id: string
    podcast_id: string
    profile_id?: string | null
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
  }

  export type EpisodeUpdateManyMutationInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeUncheckedUpdateManyInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    notification_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
    user: UserCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    notification_id: string
    user_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    notification_id: string
    user_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PodcastCreateInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutPodcastInput
    episode?: EpisodeCreateNestedManyWithoutPodcastInput
    user?: UserCreateNestedOneWithoutPodcastInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutPodcastInput
  }

  export type PodcastUncheckedCreateInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutPodcastInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutPodcastInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutPodcastInput
  }

  export type PodcastUpdateInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUpdateManyWithoutPodcastNestedInput
    user?: UserUpdateOneWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastCreateManyInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
  }

  export type PodcastUpdateManyMutationInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PodcastUncheckedUpdateManyInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePodcastCreateInput = {
    podcast: PodcastCreateNestedOneWithoutProfile_podcastInput
    user_curation_profile: UserCurationProfileCreateNestedOneWithoutProfile_podcastInput
  }

  export type ProfilePodcastUncheckedCreateInput = {
    profile_id: string
    podcast_id: string
  }

  export type ProfilePodcastUpdateInput = {
    podcast?: PodcastUpdateOneRequiredWithoutProfile_podcastNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneRequiredWithoutProfile_podcastNestedInput
  }

  export type ProfilePodcastUncheckedUpdateInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProfilePodcastCreateManyInput = {
    profile_id: string
    podcast_id: string
  }

  export type ProfilePodcastUpdateManyMutationInput = {

  }

  export type ProfilePodcastUncheckedUpdateManyInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionCreateInput = {
    subscription_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    subscription_id: string
    user_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type SubscriptionUpdateInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    subscription_id: string
    user_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
  }

  export type UserUpdateManyMutationInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCurationProfileCreateInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    episode?: EpisodeCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutUser_curation_profileInput
    bundle?: BundleCreateNestedOneWithoutUser_curation_profileInput
    user: UserCreateNestedOneWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUncheckedCreateInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: string | null
    episode?: EpisodeUncheckedCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUpdateInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    episode?: EpisodeUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutUser_curation_profileNestedInput
    bundle?: BundleUpdateOneWithoutUser_curation_profileNestedInput
    user?: UserUpdateOneRequiredWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    selected_bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    episode?: EpisodeUncheckedUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileCreateManyInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: string | null
  }

  export type UserCurationProfileUpdateManyMutationInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCurationProfileUncheckedUpdateManyInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    selected_bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumFeedbackRatingFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackRating | EnumFeedbackRatingFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackRatingFilter<$PrismaModel> | $Enums.FeedbackRating
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EpisodeScalarRelationFilter = {
    is?: EpisodeWhereInput
    isNot?: EpisodeWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type EpisodeFeedbackUserIdEpisodeIdCompoundUniqueInput = {
    userId: string
    episodeId: string
  }

  export type EpisodeFeedbackCountOrderByAggregateInput = {
    feedback_id?: SortOrder
    userId?: SortOrder
    episodeId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EpisodeFeedbackMaxOrderByAggregateInput = {
    feedback_id?: SortOrder
    userId?: SortOrder
    episodeId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EpisodeFeedbackMinOrderByAggregateInput = {
    feedback_id?: SortOrder
    userId?: SortOrder
    episodeId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumFeedbackRatingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackRating | EnumFeedbackRatingFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackRatingWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackRating
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackRatingFilter<$PrismaModel>
    _max?: NestedEnumFeedbackRatingFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type BundlePodcastListRelationFilter = {
    every?: BundlePodcastWhereInput
    some?: BundlePodcastWhereInput
    none?: BundlePodcastWhereInput
  }

  export type EpisodeListRelationFilter = {
    every?: EpisodeWhereInput
    some?: EpisodeWhereInput
    none?: EpisodeWhereInput
  }

  export type UserCurationProfileListRelationFilter = {
    every?: UserCurationProfileWhereInput
    some?: UserCurationProfileWhereInput
    none?: UserCurationProfileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BundlePodcastOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EpisodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCurationProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BundleCountOrderByAggregateInput = {
    bundle_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    is_static?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type BundleMaxOrderByAggregateInput = {
    bundle_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    is_static?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type BundleMinOrderByAggregateInput = {
    bundle_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    is_static?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BundleScalarRelationFilter = {
    is?: BundleWhereInput
    isNot?: BundleWhereInput
  }

  export type PodcastScalarRelationFilter = {
    is?: PodcastWhereInput
    isNot?: PodcastWhereInput
  }

  export type BundlePodcastBundle_idPodcast_idCompoundUniqueInput = {
    bundle_id: string
    podcast_id: string
  }

  export type BundlePodcastCountOrderByAggregateInput = {
    bundle_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type BundlePodcastMaxOrderByAggregateInput = {
    bundle_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type BundlePodcastMinOrderByAggregateInput = {
    bundle_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BundleNullableScalarRelationFilter = {
    is?: BundleWhereInput | null
    isNot?: BundleWhereInput | null
  }

  export type UserCurationProfileNullableScalarRelationFilter = {
    is?: UserCurationProfileWhereInput | null
    isNot?: UserCurationProfileWhereInput | null
  }

  export type EpisodeFeedbackListRelationFilter = {
    every?: EpisodeFeedbackWhereInput
    some?: EpisodeFeedbackWhereInput
    none?: EpisodeFeedbackWhereInput
  }

  export type EpisodeFeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EpisodeCountOrderByAggregateInput = {
    episode_id?: SortOrder
    podcast_id?: SortOrder
    profile_id?: SortOrder
    bundle_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    published_at?: SortOrder
    week_nr?: SortOrder
    created_at?: SortOrder
  }

  export type EpisodeMaxOrderByAggregateInput = {
    episode_id?: SortOrder
    podcast_id?: SortOrder
    profile_id?: SortOrder
    bundle_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    published_at?: SortOrder
    week_nr?: SortOrder
    created_at?: SortOrder
  }

  export type EpisodeMinOrderByAggregateInput = {
    episode_id?: SortOrder
    podcast_id?: SortOrder
    profile_id?: SortOrder
    bundle_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    published_at?: SortOrder
    week_nr?: SortOrder
    created_at?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    type?: SortOrder
    message?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type ProfilePodcastListRelationFilter = {
    every?: ProfilePodcastWhereInput
    some?: ProfilePodcastWhereInput
    none?: ProfilePodcastWhereInput
  }

  export type ProfilePodcastOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PodcastCountOrderByAggregateInput = {
    podcast_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    category?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type PodcastMaxOrderByAggregateInput = {
    podcast_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    category?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type PodcastMinOrderByAggregateInput = {
    podcast_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    category?: SortOrder
    is_active?: SortOrder
    owner_user_id?: SortOrder
    created_at?: SortOrder
  }

  export type UserCurationProfileScalarRelationFilter = {
    is?: UserCurationProfileWhereInput
    isNot?: UserCurationProfileWhereInput
  }

  export type ProfilePodcastProfile_idPodcast_idCompoundUniqueInput = {
    profile_id: string
    podcast_id: string
  }

  export type ProfilePodcastCountOrderByAggregateInput = {
    profile_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type ProfilePodcastMaxOrderByAggregateInput = {
    profile_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type ProfilePodcastMinOrderByAggregateInput = {
    profile_id?: SortOrder
    podcast_id?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    subscription_id?: SortOrder
    user_id?: SortOrder
    link_customer_id?: SortOrder
    link_subscription_id?: SortOrder
    link_price_id?: SortOrder
    status?: SortOrder
    current_period_start?: SortOrder
    current_period_end?: SortOrder
    trail_start?: SortOrder
    trial_end?: SortOrder
    canceled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    subscription_id?: SortOrder
    user_id?: SortOrder
    link_customer_id?: SortOrder
    link_subscription_id?: SortOrder
    link_price_id?: SortOrder
    status?: SortOrder
    current_period_start?: SortOrder
    current_period_end?: SortOrder
    trail_start?: SortOrder
    trial_end?: SortOrder
    canceled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    subscription_id?: SortOrder
    user_id?: SortOrder
    link_customer_id?: SortOrder
    link_subscription_id?: SortOrder
    link_price_id?: SortOrder
    status?: SortOrder
    current_period_start?: SortOrder
    current_period_end?: SortOrder
    trail_start?: SortOrder
    trial_end?: SortOrder
    canceled_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BundleListRelationFilter = {
    every?: BundleWhereInput
    some?: BundleWhereInput
    none?: BundleWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type PodcastListRelationFilter = {
    every?: PodcastWhereInput
    some?: PodcastWhereInput
    none?: PodcastWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type BundleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PodcastOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    email_verified?: SortOrder
    is_admin?: SortOrder
    email_notifications?: SortOrder
    in_app_notifications?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    email_verified?: SortOrder
    is_admin?: SortOrder
    email_notifications?: SortOrder
    in_app_notifications?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    email_verified?: SortOrder
    is_admin?: SortOrder
    email_notifications?: SortOrder
    in_app_notifications?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserCurationProfileCountOrderByAggregateInput = {
    profile_id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    generated_at?: SortOrder
    last_generation_date?: SortOrder
    next_generation_date?: SortOrder
    is_active?: SortOrder
    is_bundle_selection?: SortOrder
    selected_bundle_id?: SortOrder
  }

  export type UserCurationProfileMaxOrderByAggregateInput = {
    profile_id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    generated_at?: SortOrder
    last_generation_date?: SortOrder
    next_generation_date?: SortOrder
    is_active?: SortOrder
    is_bundle_selection?: SortOrder
    selected_bundle_id?: SortOrder
  }

  export type UserCurationProfileMinOrderByAggregateInput = {
    profile_id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    audio_url?: SortOrder
    image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    generated_at?: SortOrder
    last_generation_date?: SortOrder
    next_generation_date?: SortOrder
    is_active?: SortOrder
    is_bundle_selection?: SortOrder
    selected_bundle_id?: SortOrder
  }

  export type EpisodeCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<EpisodeCreateWithoutFeedbackInput, EpisodeUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: EpisodeCreateOrConnectWithoutFeedbackInput
    connect?: EpisodeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumFeedbackRatingFieldUpdateOperationsInput = {
    set?: $Enums.FeedbackRating
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EpisodeUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<EpisodeCreateWithoutFeedbackInput, EpisodeUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: EpisodeCreateOrConnectWithoutFeedbackInput
    upsert?: EpisodeUpsertWithoutFeedbackInput
    connect?: EpisodeWhereUniqueInput
    update?: XOR<XOR<EpisodeUpdateToOneWithWhereWithoutFeedbackInput, EpisodeUpdateWithoutFeedbackInput>, EpisodeUncheckedUpdateWithoutFeedbackInput>
  }

  export type UserUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackInput
    upsert?: UserUpsertWithoutFeedbackInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFeedbackInput, UserUpdateWithoutFeedbackInput>, UserUncheckedUpdateWithoutFeedbackInput>
  }

  export type UserCreateNestedOneWithoutBundleInput = {
    create?: XOR<UserCreateWithoutBundleInput, UserUncheckedCreateWithoutBundleInput>
    connectOrCreate?: UserCreateOrConnectWithoutBundleInput
    connect?: UserWhereUniqueInput
  }

  export type BundlePodcastCreateNestedManyWithoutBundleInput = {
    create?: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput> | BundlePodcastCreateWithoutBundleInput[] | BundlePodcastUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutBundleInput | BundlePodcastCreateOrConnectWithoutBundleInput[]
    createMany?: BundlePodcastCreateManyBundleInputEnvelope
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
  }

  export type EpisodeCreateNestedManyWithoutBundleInput = {
    create?: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput> | EpisodeCreateWithoutBundleInput[] | EpisodeUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutBundleInput | EpisodeCreateOrConnectWithoutBundleInput[]
    createMany?: EpisodeCreateManyBundleInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type UserCurationProfileCreateNestedManyWithoutBundleInput = {
    create?: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput> | UserCurationProfileCreateWithoutBundleInput[] | UserCurationProfileUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutBundleInput | UserCurationProfileCreateOrConnectWithoutBundleInput[]
    createMany?: UserCurationProfileCreateManyBundleInputEnvelope
    connect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
  }

  export type BundlePodcastUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput> | BundlePodcastCreateWithoutBundleInput[] | BundlePodcastUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutBundleInput | BundlePodcastCreateOrConnectWithoutBundleInput[]
    createMany?: BundlePodcastCreateManyBundleInputEnvelope
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
  }

  export type EpisodeUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput> | EpisodeCreateWithoutBundleInput[] | EpisodeUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutBundleInput | EpisodeCreateOrConnectWithoutBundleInput[]
    createMany?: EpisodeCreateManyBundleInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type UserCurationProfileUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput> | UserCurationProfileCreateWithoutBundleInput[] | UserCurationProfileUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutBundleInput | UserCurationProfileCreateOrConnectWithoutBundleInput[]
    createMany?: UserCurationProfileCreateManyBundleInputEnvelope
    connect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutBundleNestedInput = {
    create?: XOR<UserCreateWithoutBundleInput, UserUncheckedCreateWithoutBundleInput>
    connectOrCreate?: UserCreateOrConnectWithoutBundleInput
    upsert?: UserUpsertWithoutBundleInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBundleInput, UserUpdateWithoutBundleInput>, UserUncheckedUpdateWithoutBundleInput>
  }

  export type BundlePodcastUpdateManyWithoutBundleNestedInput = {
    create?: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput> | BundlePodcastCreateWithoutBundleInput[] | BundlePodcastUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutBundleInput | BundlePodcastCreateOrConnectWithoutBundleInput[]
    upsert?: BundlePodcastUpsertWithWhereUniqueWithoutBundleInput | BundlePodcastUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: BundlePodcastCreateManyBundleInputEnvelope
    set?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    disconnect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    delete?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    update?: BundlePodcastUpdateWithWhereUniqueWithoutBundleInput | BundlePodcastUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: BundlePodcastUpdateManyWithWhereWithoutBundleInput | BundlePodcastUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
  }

  export type EpisodeUpdateManyWithoutBundleNestedInput = {
    create?: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput> | EpisodeCreateWithoutBundleInput[] | EpisodeUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutBundleInput | EpisodeCreateOrConnectWithoutBundleInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutBundleInput | EpisodeUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: EpisodeCreateManyBundleInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutBundleInput | EpisodeUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutBundleInput | EpisodeUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type UserCurationProfileUpdateManyWithoutBundleNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput> | UserCurationProfileCreateWithoutBundleInput[] | UserCurationProfileUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutBundleInput | UserCurationProfileCreateOrConnectWithoutBundleInput[]
    upsert?: UserCurationProfileUpsertWithWhereUniqueWithoutBundleInput | UserCurationProfileUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: UserCurationProfileCreateManyBundleInputEnvelope
    set?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    disconnect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    delete?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    connect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    update?: UserCurationProfileUpdateWithWhereUniqueWithoutBundleInput | UserCurationProfileUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: UserCurationProfileUpdateManyWithWhereWithoutBundleInput | UserCurationProfileUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: UserCurationProfileScalarWhereInput | UserCurationProfileScalarWhereInput[]
  }

  export type BundlePodcastUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput> | BundlePodcastCreateWithoutBundleInput[] | BundlePodcastUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutBundleInput | BundlePodcastCreateOrConnectWithoutBundleInput[]
    upsert?: BundlePodcastUpsertWithWhereUniqueWithoutBundleInput | BundlePodcastUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: BundlePodcastCreateManyBundleInputEnvelope
    set?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    disconnect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    delete?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    update?: BundlePodcastUpdateWithWhereUniqueWithoutBundleInput | BundlePodcastUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: BundlePodcastUpdateManyWithWhereWithoutBundleInput | BundlePodcastUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
  }

  export type EpisodeUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput> | EpisodeCreateWithoutBundleInput[] | EpisodeUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutBundleInput | EpisodeCreateOrConnectWithoutBundleInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutBundleInput | EpisodeUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: EpisodeCreateManyBundleInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutBundleInput | EpisodeUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutBundleInput | EpisodeUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type UserCurationProfileUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput> | UserCurationProfileCreateWithoutBundleInput[] | UserCurationProfileUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutBundleInput | UserCurationProfileCreateOrConnectWithoutBundleInput[]
    upsert?: UserCurationProfileUpsertWithWhereUniqueWithoutBundleInput | UserCurationProfileUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: UserCurationProfileCreateManyBundleInputEnvelope
    set?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    disconnect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    delete?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    connect?: UserCurationProfileWhereUniqueInput | UserCurationProfileWhereUniqueInput[]
    update?: UserCurationProfileUpdateWithWhereUniqueWithoutBundleInput | UserCurationProfileUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: UserCurationProfileUpdateManyWithWhereWithoutBundleInput | UserCurationProfileUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: UserCurationProfileScalarWhereInput | UserCurationProfileScalarWhereInput[]
  }

  export type BundleCreateNestedOneWithoutBundle_podcastInput = {
    create?: XOR<BundleCreateWithoutBundle_podcastInput, BundleUncheckedCreateWithoutBundle_podcastInput>
    connectOrCreate?: BundleCreateOrConnectWithoutBundle_podcastInput
    connect?: BundleWhereUniqueInput
  }

  export type PodcastCreateNestedOneWithoutBundle_podcastInput = {
    create?: XOR<PodcastCreateWithoutBundle_podcastInput, PodcastUncheckedCreateWithoutBundle_podcastInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutBundle_podcastInput
    connect?: PodcastWhereUniqueInput
  }

  export type BundleUpdateOneRequiredWithoutBundle_podcastNestedInput = {
    create?: XOR<BundleCreateWithoutBundle_podcastInput, BundleUncheckedCreateWithoutBundle_podcastInput>
    connectOrCreate?: BundleCreateOrConnectWithoutBundle_podcastInput
    upsert?: BundleUpsertWithoutBundle_podcastInput
    connect?: BundleWhereUniqueInput
    update?: XOR<XOR<BundleUpdateToOneWithWhereWithoutBundle_podcastInput, BundleUpdateWithoutBundle_podcastInput>, BundleUncheckedUpdateWithoutBundle_podcastInput>
  }

  export type PodcastUpdateOneRequiredWithoutBundle_podcastNestedInput = {
    create?: XOR<PodcastCreateWithoutBundle_podcastInput, PodcastUncheckedCreateWithoutBundle_podcastInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutBundle_podcastInput
    upsert?: PodcastUpsertWithoutBundle_podcastInput
    connect?: PodcastWhereUniqueInput
    update?: XOR<XOR<PodcastUpdateToOneWithWhereWithoutBundle_podcastInput, PodcastUpdateWithoutBundle_podcastInput>, PodcastUncheckedUpdateWithoutBundle_podcastInput>
  }

  export type BundleCreateNestedOneWithoutEpisodeInput = {
    create?: XOR<BundleCreateWithoutEpisodeInput, BundleUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: BundleCreateOrConnectWithoutEpisodeInput
    connect?: BundleWhereUniqueInput
  }

  export type PodcastCreateNestedOneWithoutEpisodeInput = {
    create?: XOR<PodcastCreateWithoutEpisodeInput, PodcastUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutEpisodeInput
    connect?: PodcastWhereUniqueInput
  }

  export type UserCurationProfileCreateNestedOneWithoutEpisodeInput = {
    create?: XOR<UserCurationProfileCreateWithoutEpisodeInput, UserCurationProfileUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutEpisodeInput
    connect?: UserCurationProfileWhereUniqueInput
  }

  export type EpisodeFeedbackCreateNestedManyWithoutEpisodeInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput> | EpisodeFeedbackCreateWithoutEpisodeInput[] | EpisodeFeedbackUncheckedCreateWithoutEpisodeInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutEpisodeInput | EpisodeFeedbackCreateOrConnectWithoutEpisodeInput[]
    createMany?: EpisodeFeedbackCreateManyEpisodeInputEnvelope
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
  }

  export type EpisodeFeedbackUncheckedCreateNestedManyWithoutEpisodeInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput> | EpisodeFeedbackCreateWithoutEpisodeInput[] | EpisodeFeedbackUncheckedCreateWithoutEpisodeInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutEpisodeInput | EpisodeFeedbackCreateOrConnectWithoutEpisodeInput[]
    createMany?: EpisodeFeedbackCreateManyEpisodeInputEnvelope
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BundleUpdateOneWithoutEpisodeNestedInput = {
    create?: XOR<BundleCreateWithoutEpisodeInput, BundleUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: BundleCreateOrConnectWithoutEpisodeInput
    upsert?: BundleUpsertWithoutEpisodeInput
    disconnect?: BundleWhereInput | boolean
    delete?: BundleWhereInput | boolean
    connect?: BundleWhereUniqueInput
    update?: XOR<XOR<BundleUpdateToOneWithWhereWithoutEpisodeInput, BundleUpdateWithoutEpisodeInput>, BundleUncheckedUpdateWithoutEpisodeInput>
  }

  export type PodcastUpdateOneRequiredWithoutEpisodeNestedInput = {
    create?: XOR<PodcastCreateWithoutEpisodeInput, PodcastUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutEpisodeInput
    upsert?: PodcastUpsertWithoutEpisodeInput
    connect?: PodcastWhereUniqueInput
    update?: XOR<XOR<PodcastUpdateToOneWithWhereWithoutEpisodeInput, PodcastUpdateWithoutEpisodeInput>, PodcastUncheckedUpdateWithoutEpisodeInput>
  }

  export type UserCurationProfileUpdateOneWithoutEpisodeNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutEpisodeInput, UserCurationProfileUncheckedCreateWithoutEpisodeInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutEpisodeInput
    upsert?: UserCurationProfileUpsertWithoutEpisodeInput
    disconnect?: UserCurationProfileWhereInput | boolean
    delete?: UserCurationProfileWhereInput | boolean
    connect?: UserCurationProfileWhereUniqueInput
    update?: XOR<XOR<UserCurationProfileUpdateToOneWithWhereWithoutEpisodeInput, UserCurationProfileUpdateWithoutEpisodeInput>, UserCurationProfileUncheckedUpdateWithoutEpisodeInput>
  }

  export type EpisodeFeedbackUpdateManyWithoutEpisodeNestedInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput> | EpisodeFeedbackCreateWithoutEpisodeInput[] | EpisodeFeedbackUncheckedCreateWithoutEpisodeInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutEpisodeInput | EpisodeFeedbackCreateOrConnectWithoutEpisodeInput[]
    upsert?: EpisodeFeedbackUpsertWithWhereUniqueWithoutEpisodeInput | EpisodeFeedbackUpsertWithWhereUniqueWithoutEpisodeInput[]
    createMany?: EpisodeFeedbackCreateManyEpisodeInputEnvelope
    set?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    disconnect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    delete?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    update?: EpisodeFeedbackUpdateWithWhereUniqueWithoutEpisodeInput | EpisodeFeedbackUpdateWithWhereUniqueWithoutEpisodeInput[]
    updateMany?: EpisodeFeedbackUpdateManyWithWhereWithoutEpisodeInput | EpisodeFeedbackUpdateManyWithWhereWithoutEpisodeInput[]
    deleteMany?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
  }

  export type EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeNestedInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput> | EpisodeFeedbackCreateWithoutEpisodeInput[] | EpisodeFeedbackUncheckedCreateWithoutEpisodeInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutEpisodeInput | EpisodeFeedbackCreateOrConnectWithoutEpisodeInput[]
    upsert?: EpisodeFeedbackUpsertWithWhereUniqueWithoutEpisodeInput | EpisodeFeedbackUpsertWithWhereUniqueWithoutEpisodeInput[]
    createMany?: EpisodeFeedbackCreateManyEpisodeInputEnvelope
    set?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    disconnect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    delete?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    update?: EpisodeFeedbackUpdateWithWhereUniqueWithoutEpisodeInput | EpisodeFeedbackUpdateWithWhereUniqueWithoutEpisodeInput[]
    updateMany?: EpisodeFeedbackUpdateManyWithWhereWithoutEpisodeInput | EpisodeFeedbackUpdateManyWithWhereWithoutEpisodeInput[]
    deleteMany?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationNestedInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    upsert?: UserUpsertWithoutNotificationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationInput, UserUpdateWithoutNotificationInput>, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type BundlePodcastCreateNestedManyWithoutPodcastInput = {
    create?: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput> | BundlePodcastCreateWithoutPodcastInput[] | BundlePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutPodcastInput | BundlePodcastCreateOrConnectWithoutPodcastInput[]
    createMany?: BundlePodcastCreateManyPodcastInputEnvelope
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
  }

  export type EpisodeCreateNestedManyWithoutPodcastInput = {
    create?: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput> | EpisodeCreateWithoutPodcastInput[] | EpisodeUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutPodcastInput | EpisodeCreateOrConnectWithoutPodcastInput[]
    createMany?: EpisodeCreateManyPodcastInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutPodcastInput = {
    create?: XOR<UserCreateWithoutPodcastInput, UserUncheckedCreateWithoutPodcastInput>
    connectOrCreate?: UserCreateOrConnectWithoutPodcastInput
    connect?: UserWhereUniqueInput
  }

  export type ProfilePodcastCreateNestedManyWithoutPodcastInput = {
    create?: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput> | ProfilePodcastCreateWithoutPodcastInput[] | ProfilePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutPodcastInput | ProfilePodcastCreateOrConnectWithoutPodcastInput[]
    createMany?: ProfilePodcastCreateManyPodcastInputEnvelope
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
  }

  export type BundlePodcastUncheckedCreateNestedManyWithoutPodcastInput = {
    create?: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput> | BundlePodcastCreateWithoutPodcastInput[] | BundlePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutPodcastInput | BundlePodcastCreateOrConnectWithoutPodcastInput[]
    createMany?: BundlePodcastCreateManyPodcastInputEnvelope
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
  }

  export type EpisodeUncheckedCreateNestedManyWithoutPodcastInput = {
    create?: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput> | EpisodeCreateWithoutPodcastInput[] | EpisodeUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutPodcastInput | EpisodeCreateOrConnectWithoutPodcastInput[]
    createMany?: EpisodeCreateManyPodcastInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type ProfilePodcastUncheckedCreateNestedManyWithoutPodcastInput = {
    create?: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput> | ProfilePodcastCreateWithoutPodcastInput[] | ProfilePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutPodcastInput | ProfilePodcastCreateOrConnectWithoutPodcastInput[]
    createMany?: ProfilePodcastCreateManyPodcastInputEnvelope
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
  }

  export type BundlePodcastUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput> | BundlePodcastCreateWithoutPodcastInput[] | BundlePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutPodcastInput | BundlePodcastCreateOrConnectWithoutPodcastInput[]
    upsert?: BundlePodcastUpsertWithWhereUniqueWithoutPodcastInput | BundlePodcastUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: BundlePodcastCreateManyPodcastInputEnvelope
    set?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    disconnect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    delete?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    update?: BundlePodcastUpdateWithWhereUniqueWithoutPodcastInput | BundlePodcastUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: BundlePodcastUpdateManyWithWhereWithoutPodcastInput | BundlePodcastUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
  }

  export type EpisodeUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput> | EpisodeCreateWithoutPodcastInput[] | EpisodeUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutPodcastInput | EpisodeCreateOrConnectWithoutPodcastInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutPodcastInput | EpisodeUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: EpisodeCreateManyPodcastInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutPodcastInput | EpisodeUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutPodcastInput | EpisodeUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type UserUpdateOneWithoutPodcastNestedInput = {
    create?: XOR<UserCreateWithoutPodcastInput, UserUncheckedCreateWithoutPodcastInput>
    connectOrCreate?: UserCreateOrConnectWithoutPodcastInput
    upsert?: UserUpsertWithoutPodcastInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPodcastInput, UserUpdateWithoutPodcastInput>, UserUncheckedUpdateWithoutPodcastInput>
  }

  export type ProfilePodcastUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput> | ProfilePodcastCreateWithoutPodcastInput[] | ProfilePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutPodcastInput | ProfilePodcastCreateOrConnectWithoutPodcastInput[]
    upsert?: ProfilePodcastUpsertWithWhereUniqueWithoutPodcastInput | ProfilePodcastUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: ProfilePodcastCreateManyPodcastInputEnvelope
    set?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    disconnect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    delete?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    update?: ProfilePodcastUpdateWithWhereUniqueWithoutPodcastInput | ProfilePodcastUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: ProfilePodcastUpdateManyWithWhereWithoutPodcastInput | ProfilePodcastUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
  }

  export type BundlePodcastUncheckedUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput> | BundlePodcastCreateWithoutPodcastInput[] | BundlePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: BundlePodcastCreateOrConnectWithoutPodcastInput | BundlePodcastCreateOrConnectWithoutPodcastInput[]
    upsert?: BundlePodcastUpsertWithWhereUniqueWithoutPodcastInput | BundlePodcastUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: BundlePodcastCreateManyPodcastInputEnvelope
    set?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    disconnect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    delete?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    connect?: BundlePodcastWhereUniqueInput | BundlePodcastWhereUniqueInput[]
    update?: BundlePodcastUpdateWithWhereUniqueWithoutPodcastInput | BundlePodcastUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: BundlePodcastUpdateManyWithWhereWithoutPodcastInput | BundlePodcastUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
  }

  export type EpisodeUncheckedUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput> | EpisodeCreateWithoutPodcastInput[] | EpisodeUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutPodcastInput | EpisodeCreateOrConnectWithoutPodcastInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutPodcastInput | EpisodeUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: EpisodeCreateManyPodcastInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutPodcastInput | EpisodeUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutPodcastInput | EpisodeUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type ProfilePodcastUncheckedUpdateManyWithoutPodcastNestedInput = {
    create?: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput> | ProfilePodcastCreateWithoutPodcastInput[] | ProfilePodcastUncheckedCreateWithoutPodcastInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutPodcastInput | ProfilePodcastCreateOrConnectWithoutPodcastInput[]
    upsert?: ProfilePodcastUpsertWithWhereUniqueWithoutPodcastInput | ProfilePodcastUpsertWithWhereUniqueWithoutPodcastInput[]
    createMany?: ProfilePodcastCreateManyPodcastInputEnvelope
    set?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    disconnect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    delete?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    update?: ProfilePodcastUpdateWithWhereUniqueWithoutPodcastInput | ProfilePodcastUpdateWithWhereUniqueWithoutPodcastInput[]
    updateMany?: ProfilePodcastUpdateManyWithWhereWithoutPodcastInput | ProfilePodcastUpdateManyWithWhereWithoutPodcastInput[]
    deleteMany?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
  }

  export type PodcastCreateNestedOneWithoutProfile_podcastInput = {
    create?: XOR<PodcastCreateWithoutProfile_podcastInput, PodcastUncheckedCreateWithoutProfile_podcastInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutProfile_podcastInput
    connect?: PodcastWhereUniqueInput
  }

  export type UserCurationProfileCreateNestedOneWithoutProfile_podcastInput = {
    create?: XOR<UserCurationProfileCreateWithoutProfile_podcastInput, UserCurationProfileUncheckedCreateWithoutProfile_podcastInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutProfile_podcastInput
    connect?: UserCurationProfileWhereUniqueInput
  }

  export type PodcastUpdateOneRequiredWithoutProfile_podcastNestedInput = {
    create?: XOR<PodcastCreateWithoutProfile_podcastInput, PodcastUncheckedCreateWithoutProfile_podcastInput>
    connectOrCreate?: PodcastCreateOrConnectWithoutProfile_podcastInput
    upsert?: PodcastUpsertWithoutProfile_podcastInput
    connect?: PodcastWhereUniqueInput
    update?: XOR<XOR<PodcastUpdateToOneWithWhereWithoutProfile_podcastInput, PodcastUpdateWithoutProfile_podcastInput>, PodcastUncheckedUpdateWithoutProfile_podcastInput>
  }

  export type UserCurationProfileUpdateOneRequiredWithoutProfile_podcastNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutProfile_podcastInput, UserCurationProfileUncheckedCreateWithoutProfile_podcastInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutProfile_podcastInput
    upsert?: UserCurationProfileUpsertWithoutProfile_podcastInput
    connect?: UserCurationProfileWhereUniqueInput
    update?: XOR<XOR<UserCurationProfileUpdateToOneWithWhereWithoutProfile_podcastInput, UserCurationProfileUpdateWithoutProfile_podcastInput>, UserCurationProfileUncheckedUpdateWithoutProfile_podcastInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type BundleCreateNestedManyWithoutUserInput = {
    create?: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput> | BundleCreateWithoutUserInput[] | BundleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutUserInput | BundleCreateOrConnectWithoutUserInput[]
    createMany?: BundleCreateManyUserInputEnvelope
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
  }

  export type EpisodeFeedbackCreateNestedManyWithoutUserInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput> | EpisodeFeedbackCreateWithoutUserInput[] | EpisodeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutUserInput | EpisodeFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: EpisodeFeedbackCreateManyUserInputEnvelope
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PodcastCreateNestedManyWithoutUserInput = {
    create?: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput> | PodcastCreateWithoutUserInput[] | PodcastUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PodcastCreateOrConnectWithoutUserInput | PodcastCreateOrConnectWithoutUserInput[]
    createMany?: PodcastCreateManyUserInputEnvelope
    connect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UserCurationProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutUserInput
    connect?: UserCurationProfileWhereUniqueInput
  }

  export type BundleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput> | BundleCreateWithoutUserInput[] | BundleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutUserInput | BundleCreateOrConnectWithoutUserInput[]
    createMany?: BundleCreateManyUserInputEnvelope
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
  }

  export type EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput> | EpisodeFeedbackCreateWithoutUserInput[] | EpisodeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutUserInput | EpisodeFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: EpisodeFeedbackCreateManyUserInputEnvelope
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PodcastUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput> | PodcastCreateWithoutUserInput[] | PodcastUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PodcastCreateOrConnectWithoutUserInput | PodcastCreateOrConnectWithoutUserInput[]
    createMany?: PodcastCreateManyUserInputEnvelope
    connect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UserCurationProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutUserInput
    connect?: UserCurationProfileWhereUniqueInput
  }

  export type BundleUpdateManyWithoutUserNestedInput = {
    create?: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput> | BundleCreateWithoutUserInput[] | BundleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutUserInput | BundleCreateOrConnectWithoutUserInput[]
    upsert?: BundleUpsertWithWhereUniqueWithoutUserInput | BundleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BundleCreateManyUserInputEnvelope
    set?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    disconnect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    delete?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    update?: BundleUpdateWithWhereUniqueWithoutUserInput | BundleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BundleUpdateManyWithWhereWithoutUserInput | BundleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BundleScalarWhereInput | BundleScalarWhereInput[]
  }

  export type EpisodeFeedbackUpdateManyWithoutUserNestedInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput> | EpisodeFeedbackCreateWithoutUserInput[] | EpisodeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutUserInput | EpisodeFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: EpisodeFeedbackUpsertWithWhereUniqueWithoutUserInput | EpisodeFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EpisodeFeedbackCreateManyUserInputEnvelope
    set?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    disconnect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    delete?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    update?: EpisodeFeedbackUpdateWithWhereUniqueWithoutUserInput | EpisodeFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EpisodeFeedbackUpdateManyWithWhereWithoutUserInput | EpisodeFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PodcastUpdateManyWithoutUserNestedInput = {
    create?: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput> | PodcastCreateWithoutUserInput[] | PodcastUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PodcastCreateOrConnectWithoutUserInput | PodcastCreateOrConnectWithoutUserInput[]
    upsert?: PodcastUpsertWithWhereUniqueWithoutUserInput | PodcastUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PodcastCreateManyUserInputEnvelope
    set?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    disconnect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    delete?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    connect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    update?: PodcastUpdateWithWhereUniqueWithoutUserInput | PodcastUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PodcastUpdateManyWithWhereWithoutUserInput | PodcastUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PodcastScalarWhereInput | PodcastScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UserCurationProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutUserInput
    upsert?: UserCurationProfileUpsertWithoutUserInput
    disconnect?: UserCurationProfileWhereInput | boolean
    delete?: UserCurationProfileWhereInput | boolean
    connect?: UserCurationProfileWhereUniqueInput
    update?: XOR<XOR<UserCurationProfileUpdateToOneWithWhereWithoutUserInput, UserCurationProfileUpdateWithoutUserInput>, UserCurationProfileUncheckedUpdateWithoutUserInput>
  }

  export type BundleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput> | BundleCreateWithoutUserInput[] | BundleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BundleCreateOrConnectWithoutUserInput | BundleCreateOrConnectWithoutUserInput[]
    upsert?: BundleUpsertWithWhereUniqueWithoutUserInput | BundleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BundleCreateManyUserInputEnvelope
    set?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    disconnect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    delete?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    connect?: BundleWhereUniqueInput | BundleWhereUniqueInput[]
    update?: BundleUpdateWithWhereUniqueWithoutUserInput | BundleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BundleUpdateManyWithWhereWithoutUserInput | BundleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BundleScalarWhereInput | BundleScalarWhereInput[]
  }

  export type EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput> | EpisodeFeedbackCreateWithoutUserInput[] | EpisodeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EpisodeFeedbackCreateOrConnectWithoutUserInput | EpisodeFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: EpisodeFeedbackUpsertWithWhereUniqueWithoutUserInput | EpisodeFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EpisodeFeedbackCreateManyUserInputEnvelope
    set?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    disconnect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    delete?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    connect?: EpisodeFeedbackWhereUniqueInput | EpisodeFeedbackWhereUniqueInput[]
    update?: EpisodeFeedbackUpdateWithWhereUniqueWithoutUserInput | EpisodeFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EpisodeFeedbackUpdateManyWithWhereWithoutUserInput | EpisodeFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PodcastUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput> | PodcastCreateWithoutUserInput[] | PodcastUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PodcastCreateOrConnectWithoutUserInput | PodcastCreateOrConnectWithoutUserInput[]
    upsert?: PodcastUpsertWithWhereUniqueWithoutUserInput | PodcastUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PodcastCreateManyUserInputEnvelope
    set?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    disconnect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    delete?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    connect?: PodcastWhereUniqueInput | PodcastWhereUniqueInput[]
    update?: PodcastUpdateWithWhereUniqueWithoutUserInput | PodcastUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PodcastUpdateManyWithWhereWithoutUserInput | PodcastUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PodcastScalarWhereInput | PodcastScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCurationProfileCreateOrConnectWithoutUserInput
    upsert?: UserCurationProfileUpsertWithoutUserInput
    disconnect?: UserCurationProfileWhereInput | boolean
    delete?: UserCurationProfileWhereInput | boolean
    connect?: UserCurationProfileWhereUniqueInput
    update?: XOR<XOR<UserCurationProfileUpdateToOneWithWhereWithoutUserInput, UserCurationProfileUpdateWithoutUserInput>, UserCurationProfileUncheckedUpdateWithoutUserInput>
  }

  export type EpisodeCreateNestedManyWithoutUser_curation_profileInput = {
    create?: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput> | EpisodeCreateWithoutUser_curation_profileInput[] | EpisodeUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutUser_curation_profileInput | EpisodeCreateOrConnectWithoutUser_curation_profileInput[]
    createMany?: EpisodeCreateManyUser_curation_profileInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type ProfilePodcastCreateNestedManyWithoutUser_curation_profileInput = {
    create?: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput> | ProfilePodcastCreateWithoutUser_curation_profileInput[] | ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput | ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput[]
    createMany?: ProfilePodcastCreateManyUser_curation_profileInputEnvelope
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
  }

  export type BundleCreateNestedOneWithoutUser_curation_profileInput = {
    create?: XOR<BundleCreateWithoutUser_curation_profileInput, BundleUncheckedCreateWithoutUser_curation_profileInput>
    connectOrCreate?: BundleCreateOrConnectWithoutUser_curation_profileInput
    connect?: BundleWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUser_curation_profileInput = {
    create?: XOR<UserCreateWithoutUser_curation_profileInput, UserUncheckedCreateWithoutUser_curation_profileInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_curation_profileInput
    connect?: UserWhereUniqueInput
  }

  export type EpisodeUncheckedCreateNestedManyWithoutUser_curation_profileInput = {
    create?: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput> | EpisodeCreateWithoutUser_curation_profileInput[] | EpisodeUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutUser_curation_profileInput | EpisodeCreateOrConnectWithoutUser_curation_profileInput[]
    createMany?: EpisodeCreateManyUser_curation_profileInputEnvelope
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
  }

  export type ProfilePodcastUncheckedCreateNestedManyWithoutUser_curation_profileInput = {
    create?: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput> | ProfilePodcastCreateWithoutUser_curation_profileInput[] | ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput | ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput[]
    createMany?: ProfilePodcastCreateManyUser_curation_profileInputEnvelope
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
  }

  export type EpisodeUpdateManyWithoutUser_curation_profileNestedInput = {
    create?: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput> | EpisodeCreateWithoutUser_curation_profileInput[] | EpisodeUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutUser_curation_profileInput | EpisodeCreateOrConnectWithoutUser_curation_profileInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutUser_curation_profileInput | EpisodeUpsertWithWhereUniqueWithoutUser_curation_profileInput[]
    createMany?: EpisodeCreateManyUser_curation_profileInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutUser_curation_profileInput | EpisodeUpdateWithWhereUniqueWithoutUser_curation_profileInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutUser_curation_profileInput | EpisodeUpdateManyWithWhereWithoutUser_curation_profileInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type ProfilePodcastUpdateManyWithoutUser_curation_profileNestedInput = {
    create?: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput> | ProfilePodcastCreateWithoutUser_curation_profileInput[] | ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput | ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput[]
    upsert?: ProfilePodcastUpsertWithWhereUniqueWithoutUser_curation_profileInput | ProfilePodcastUpsertWithWhereUniqueWithoutUser_curation_profileInput[]
    createMany?: ProfilePodcastCreateManyUser_curation_profileInputEnvelope
    set?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    disconnect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    delete?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    update?: ProfilePodcastUpdateWithWhereUniqueWithoutUser_curation_profileInput | ProfilePodcastUpdateWithWhereUniqueWithoutUser_curation_profileInput[]
    updateMany?: ProfilePodcastUpdateManyWithWhereWithoutUser_curation_profileInput | ProfilePodcastUpdateManyWithWhereWithoutUser_curation_profileInput[]
    deleteMany?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
  }

  export type BundleUpdateOneWithoutUser_curation_profileNestedInput = {
    create?: XOR<BundleCreateWithoutUser_curation_profileInput, BundleUncheckedCreateWithoutUser_curation_profileInput>
    connectOrCreate?: BundleCreateOrConnectWithoutUser_curation_profileInput
    upsert?: BundleUpsertWithoutUser_curation_profileInput
    disconnect?: BundleWhereInput | boolean
    delete?: BundleWhereInput | boolean
    connect?: BundleWhereUniqueInput
    update?: XOR<XOR<BundleUpdateToOneWithWhereWithoutUser_curation_profileInput, BundleUpdateWithoutUser_curation_profileInput>, BundleUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type UserUpdateOneRequiredWithoutUser_curation_profileNestedInput = {
    create?: XOR<UserCreateWithoutUser_curation_profileInput, UserUncheckedCreateWithoutUser_curation_profileInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_curation_profileInput
    upsert?: UserUpsertWithoutUser_curation_profileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUser_curation_profileInput, UserUpdateWithoutUser_curation_profileInput>, UserUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type EpisodeUncheckedUpdateManyWithoutUser_curation_profileNestedInput = {
    create?: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput> | EpisodeCreateWithoutUser_curation_profileInput[] | EpisodeUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: EpisodeCreateOrConnectWithoutUser_curation_profileInput | EpisodeCreateOrConnectWithoutUser_curation_profileInput[]
    upsert?: EpisodeUpsertWithWhereUniqueWithoutUser_curation_profileInput | EpisodeUpsertWithWhereUniqueWithoutUser_curation_profileInput[]
    createMany?: EpisodeCreateManyUser_curation_profileInputEnvelope
    set?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    disconnect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    delete?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    connect?: EpisodeWhereUniqueInput | EpisodeWhereUniqueInput[]
    update?: EpisodeUpdateWithWhereUniqueWithoutUser_curation_profileInput | EpisodeUpdateWithWhereUniqueWithoutUser_curation_profileInput[]
    updateMany?: EpisodeUpdateManyWithWhereWithoutUser_curation_profileInput | EpisodeUpdateManyWithWhereWithoutUser_curation_profileInput[]
    deleteMany?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
  }

  export type ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileNestedInput = {
    create?: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput> | ProfilePodcastCreateWithoutUser_curation_profileInput[] | ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput[]
    connectOrCreate?: ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput | ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput[]
    upsert?: ProfilePodcastUpsertWithWhereUniqueWithoutUser_curation_profileInput | ProfilePodcastUpsertWithWhereUniqueWithoutUser_curation_profileInput[]
    createMany?: ProfilePodcastCreateManyUser_curation_profileInputEnvelope
    set?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    disconnect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    delete?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    connect?: ProfilePodcastWhereUniqueInput | ProfilePodcastWhereUniqueInput[]
    update?: ProfilePodcastUpdateWithWhereUniqueWithoutUser_curation_profileInput | ProfilePodcastUpdateWithWhereUniqueWithoutUser_curation_profileInput[]
    updateMany?: ProfilePodcastUpdateManyWithWhereWithoutUser_curation_profileInput | ProfilePodcastUpdateManyWithWhereWithoutUser_curation_profileInput[]
    deleteMany?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumFeedbackRatingFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackRating | EnumFeedbackRatingFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackRatingFilter<$PrismaModel> | $Enums.FeedbackRating
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumFeedbackRatingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackRating | EnumFeedbackRatingFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackRating[] | ListEnumFeedbackRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackRatingWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackRating
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackRatingFilter<$PrismaModel>
    _max?: NestedEnumFeedbackRatingFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EpisodeCreateWithoutFeedbackInput = {
    episode_id: string
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    bundle?: BundleCreateNestedOneWithoutEpisodeInput
    podcast: PodcastCreateNestedOneWithoutEpisodeInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutEpisodeInput
  }

  export type EpisodeUncheckedCreateWithoutFeedbackInput = {
    episode_id: string
    podcast_id: string
    profile_id?: string | null
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
  }

  export type EpisodeCreateOrConnectWithoutFeedbackInput = {
    where: EpisodeWhereUniqueInput
    create: XOR<EpisodeCreateWithoutFeedbackInput, EpisodeUncheckedCreateWithoutFeedbackInput>
  }

  export type UserCreateWithoutFeedbackInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFeedbackInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFeedbackInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
  }

  export type EpisodeUpsertWithoutFeedbackInput = {
    update: XOR<EpisodeUpdateWithoutFeedbackInput, EpisodeUncheckedUpdateWithoutFeedbackInput>
    create: XOR<EpisodeCreateWithoutFeedbackInput, EpisodeUncheckedCreateWithoutFeedbackInput>
    where?: EpisodeWhereInput
  }

  export type EpisodeUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: EpisodeWhereInput
    data: XOR<EpisodeUpdateWithoutFeedbackInput, EpisodeUncheckedUpdateWithoutFeedbackInput>
  }

  export type EpisodeUpdateWithoutFeedbackInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneWithoutEpisodeNestedInput
    podcast?: PodcastUpdateOneRequiredWithoutEpisodeNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateWithoutFeedbackInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutFeedbackInput = {
    update: XOR<UserUpdateWithoutFeedbackInput, UserUncheckedUpdateWithoutFeedbackInput>
    create: XOR<UserCreateWithoutFeedbackInput, UserUncheckedCreateWithoutFeedbackInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFeedbackInput, UserUncheckedUpdateWithoutFeedbackInput>
  }

  export type UserUpdateWithoutFeedbackInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFeedbackInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutBundleInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBundleInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBundleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBundleInput, UserUncheckedCreateWithoutBundleInput>
  }

  export type BundlePodcastCreateWithoutBundleInput = {
    podcast: PodcastCreateNestedOneWithoutBundle_podcastInput
  }

  export type BundlePodcastUncheckedCreateWithoutBundleInput = {
    podcast_id: string
  }

  export type BundlePodcastCreateOrConnectWithoutBundleInput = {
    where: BundlePodcastWhereUniqueInput
    create: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput>
  }

  export type BundlePodcastCreateManyBundleInputEnvelope = {
    data: BundlePodcastCreateManyBundleInput | BundlePodcastCreateManyBundleInput[]
    skipDuplicates?: boolean
  }

  export type EpisodeCreateWithoutBundleInput = {
    episode_id: string
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    podcast: PodcastCreateNestedOneWithoutEpisodeInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutEpisodeInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeUncheckedCreateWithoutBundleInput = {
    episode_id: string
    podcast_id: string
    profile_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeCreateOrConnectWithoutBundleInput = {
    where: EpisodeWhereUniqueInput
    create: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput>
  }

  export type EpisodeCreateManyBundleInputEnvelope = {
    data: EpisodeCreateManyBundleInput | EpisodeCreateManyBundleInput[]
    skipDuplicates?: boolean
  }

  export type UserCurationProfileCreateWithoutBundleInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    episode?: EpisodeCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutUser_curation_profileInput
    user: UserCreateNestedOneWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUncheckedCreateWithoutBundleInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    episode?: EpisodeUncheckedCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutUser_curation_profileInput
  }

  export type UserCurationProfileCreateOrConnectWithoutBundleInput = {
    where: UserCurationProfileWhereUniqueInput
    create: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput>
  }

  export type UserCurationProfileCreateManyBundleInputEnvelope = {
    data: UserCurationProfileCreateManyBundleInput | UserCurationProfileCreateManyBundleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBundleInput = {
    update: XOR<UserUpdateWithoutBundleInput, UserUncheckedUpdateWithoutBundleInput>
    create: XOR<UserCreateWithoutBundleInput, UserUncheckedCreateWithoutBundleInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBundleInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBundleInput, UserUncheckedUpdateWithoutBundleInput>
  }

  export type UserUpdateWithoutBundleInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBundleInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type BundlePodcastUpsertWithWhereUniqueWithoutBundleInput = {
    where: BundlePodcastWhereUniqueInput
    update: XOR<BundlePodcastUpdateWithoutBundleInput, BundlePodcastUncheckedUpdateWithoutBundleInput>
    create: XOR<BundlePodcastCreateWithoutBundleInput, BundlePodcastUncheckedCreateWithoutBundleInput>
  }

  export type BundlePodcastUpdateWithWhereUniqueWithoutBundleInput = {
    where: BundlePodcastWhereUniqueInput
    data: XOR<BundlePodcastUpdateWithoutBundleInput, BundlePodcastUncheckedUpdateWithoutBundleInput>
  }

  export type BundlePodcastUpdateManyWithWhereWithoutBundleInput = {
    where: BundlePodcastScalarWhereInput
    data: XOR<BundlePodcastUpdateManyMutationInput, BundlePodcastUncheckedUpdateManyWithoutBundleInput>
  }

  export type BundlePodcastScalarWhereInput = {
    AND?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
    OR?: BundlePodcastScalarWhereInput[]
    NOT?: BundlePodcastScalarWhereInput | BundlePodcastScalarWhereInput[]
    bundle_id?: StringFilter<"BundlePodcast"> | string
    podcast_id?: StringFilter<"BundlePodcast"> | string
  }

  export type EpisodeUpsertWithWhereUniqueWithoutBundleInput = {
    where: EpisodeWhereUniqueInput
    update: XOR<EpisodeUpdateWithoutBundleInput, EpisodeUncheckedUpdateWithoutBundleInput>
    create: XOR<EpisodeCreateWithoutBundleInput, EpisodeUncheckedCreateWithoutBundleInput>
  }

  export type EpisodeUpdateWithWhereUniqueWithoutBundleInput = {
    where: EpisodeWhereUniqueInput
    data: XOR<EpisodeUpdateWithoutBundleInput, EpisodeUncheckedUpdateWithoutBundleInput>
  }

  export type EpisodeUpdateManyWithWhereWithoutBundleInput = {
    where: EpisodeScalarWhereInput
    data: XOR<EpisodeUpdateManyMutationInput, EpisodeUncheckedUpdateManyWithoutBundleInput>
  }

  export type EpisodeScalarWhereInput = {
    AND?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
    OR?: EpisodeScalarWhereInput[]
    NOT?: EpisodeScalarWhereInput | EpisodeScalarWhereInput[]
    episode_id?: StringFilter<"Episode"> | string
    podcast_id?: StringFilter<"Episode"> | string
    profile_id?: StringNullableFilter<"Episode"> | string | null
    bundle_id?: StringNullableFilter<"Episode"> | string | null
    title?: StringFilter<"Episode"> | string
    description?: StringNullableFilter<"Episode"> | string | null
    audio_url?: StringFilter<"Episode"> | string
    image_url?: StringNullableFilter<"Episode"> | string | null
    published_at?: DateTimeNullableFilter<"Episode"> | Date | string | null
    week_nr?: DateTimeNullableFilter<"Episode"> | Date | string | null
    created_at?: DateTimeFilter<"Episode"> | Date | string
  }

  export type UserCurationProfileUpsertWithWhereUniqueWithoutBundleInput = {
    where: UserCurationProfileWhereUniqueInput
    update: XOR<UserCurationProfileUpdateWithoutBundleInput, UserCurationProfileUncheckedUpdateWithoutBundleInput>
    create: XOR<UserCurationProfileCreateWithoutBundleInput, UserCurationProfileUncheckedCreateWithoutBundleInput>
  }

  export type UserCurationProfileUpdateWithWhereUniqueWithoutBundleInput = {
    where: UserCurationProfileWhereUniqueInput
    data: XOR<UserCurationProfileUpdateWithoutBundleInput, UserCurationProfileUncheckedUpdateWithoutBundleInput>
  }

  export type UserCurationProfileUpdateManyWithWhereWithoutBundleInput = {
    where: UserCurationProfileScalarWhereInput
    data: XOR<UserCurationProfileUpdateManyMutationInput, UserCurationProfileUncheckedUpdateManyWithoutBundleInput>
  }

  export type UserCurationProfileScalarWhereInput = {
    AND?: UserCurationProfileScalarWhereInput | UserCurationProfileScalarWhereInput[]
    OR?: UserCurationProfileScalarWhereInput[]
    NOT?: UserCurationProfileScalarWhereInput | UserCurationProfileScalarWhereInput[]
    profile_id?: StringFilter<"UserCurationProfile"> | string
    user_id?: StringFilter<"UserCurationProfile"> | string
    name?: StringFilter<"UserCurationProfile"> | string
    status?: StringFilter<"UserCurationProfile"> | string
    audio_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    image_url?: StringNullableFilter<"UserCurationProfile"> | string | null
    created_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    updated_at?: DateTimeFilter<"UserCurationProfile"> | Date | string
    generated_at?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    last_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    next_generation_date?: DateTimeNullableFilter<"UserCurationProfile"> | Date | string | null
    is_active?: BoolFilter<"UserCurationProfile"> | boolean
    is_bundle_selection?: BoolFilter<"UserCurationProfile"> | boolean
    selected_bundle_id?: StringNullableFilter<"UserCurationProfile"> | string | null
  }

  export type BundleCreateWithoutBundle_podcastInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutBundleInput
    episode?: EpisodeCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutBundle_podcastInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    episode?: EpisodeUncheckedCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutBundle_podcastInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutBundle_podcastInput, BundleUncheckedCreateWithoutBundle_podcastInput>
  }

  export type PodcastCreateWithoutBundle_podcastInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    episode?: EpisodeCreateNestedManyWithoutPodcastInput
    user?: UserCreateNestedOneWithoutPodcastInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutPodcastInput
  }

  export type PodcastUncheckedCreateWithoutBundle_podcastInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    episode?: EpisodeUncheckedCreateNestedManyWithoutPodcastInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutPodcastInput
  }

  export type PodcastCreateOrConnectWithoutBundle_podcastInput = {
    where: PodcastWhereUniqueInput
    create: XOR<PodcastCreateWithoutBundle_podcastInput, PodcastUncheckedCreateWithoutBundle_podcastInput>
  }

  export type BundleUpsertWithoutBundle_podcastInput = {
    update: XOR<BundleUpdateWithoutBundle_podcastInput, BundleUncheckedUpdateWithoutBundle_podcastInput>
    create: XOR<BundleCreateWithoutBundle_podcastInput, BundleUncheckedCreateWithoutBundle_podcastInput>
    where?: BundleWhereInput
  }

  export type BundleUpdateToOneWithWhereWithoutBundle_podcastInput = {
    where?: BundleWhereInput
    data: XOR<BundleUpdateWithoutBundle_podcastInput, BundleUncheckedUpdateWithoutBundle_podcastInput>
  }

  export type BundleUpdateWithoutBundle_podcastInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutBundleNestedInput
    episode?: EpisodeUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutBundle_podcastInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    episode?: EpisodeUncheckedUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type PodcastUpsertWithoutBundle_podcastInput = {
    update: XOR<PodcastUpdateWithoutBundle_podcastInput, PodcastUncheckedUpdateWithoutBundle_podcastInput>
    create: XOR<PodcastCreateWithoutBundle_podcastInput, PodcastUncheckedCreateWithoutBundle_podcastInput>
    where?: PodcastWhereInput
  }

  export type PodcastUpdateToOneWithWhereWithoutBundle_podcastInput = {
    where?: PodcastWhereInput
    data: XOR<PodcastUpdateWithoutBundle_podcastInput, PodcastUncheckedUpdateWithoutBundle_podcastInput>
  }

  export type PodcastUpdateWithoutBundle_podcastInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    episode?: EpisodeUpdateManyWithoutPodcastNestedInput
    user?: UserUpdateOneWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateWithoutBundle_podcastInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    episode?: EpisodeUncheckedUpdateManyWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutPodcastNestedInput
  }

  export type BundleCreateWithoutEpisodeInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutBundleInput
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutEpisodeInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutEpisodeInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutEpisodeInput, BundleUncheckedCreateWithoutEpisodeInput>
  }

  export type PodcastCreateWithoutEpisodeInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutPodcastInput
    user?: UserCreateNestedOneWithoutPodcastInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutPodcastInput
  }

  export type PodcastUncheckedCreateWithoutEpisodeInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutPodcastInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutPodcastInput
  }

  export type PodcastCreateOrConnectWithoutEpisodeInput = {
    where: PodcastWhereUniqueInput
    create: XOR<PodcastCreateWithoutEpisodeInput, PodcastUncheckedCreateWithoutEpisodeInput>
  }

  export type UserCurationProfileCreateWithoutEpisodeInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutUser_curation_profileInput
    bundle?: BundleCreateNestedOneWithoutUser_curation_profileInput
    user: UserCreateNestedOneWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUncheckedCreateWithoutEpisodeInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: string | null
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutUser_curation_profileInput
  }

  export type UserCurationProfileCreateOrConnectWithoutEpisodeInput = {
    where: UserCurationProfileWhereUniqueInput
    create: XOR<UserCurationProfileCreateWithoutEpisodeInput, UserCurationProfileUncheckedCreateWithoutEpisodeInput>
  }

  export type EpisodeFeedbackCreateWithoutEpisodeInput = {
    feedback_id: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFeedbackInput
  }

  export type EpisodeFeedbackUncheckedCreateWithoutEpisodeInput = {
    feedback_id: string
    userId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EpisodeFeedbackCreateOrConnectWithoutEpisodeInput = {
    where: EpisodeFeedbackWhereUniqueInput
    create: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput>
  }

  export type EpisodeFeedbackCreateManyEpisodeInputEnvelope = {
    data: EpisodeFeedbackCreateManyEpisodeInput | EpisodeFeedbackCreateManyEpisodeInput[]
    skipDuplicates?: boolean
  }

  export type BundleUpsertWithoutEpisodeInput = {
    update: XOR<BundleUpdateWithoutEpisodeInput, BundleUncheckedUpdateWithoutEpisodeInput>
    create: XOR<BundleCreateWithoutEpisodeInput, BundleUncheckedCreateWithoutEpisodeInput>
    where?: BundleWhereInput
  }

  export type BundleUpdateToOneWithWhereWithoutEpisodeInput = {
    where?: BundleWhereInput
    data: XOR<BundleUpdateWithoutEpisodeInput, BundleUncheckedUpdateWithoutEpisodeInput>
  }

  export type BundleUpdateWithoutEpisodeInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutBundleNestedInput
    bundle_podcast?: BundlePodcastUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutEpisodeInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type PodcastUpsertWithoutEpisodeInput = {
    update: XOR<PodcastUpdateWithoutEpisodeInput, PodcastUncheckedUpdateWithoutEpisodeInput>
    create: XOR<PodcastCreateWithoutEpisodeInput, PodcastUncheckedCreateWithoutEpisodeInput>
    where?: PodcastWhereInput
  }

  export type PodcastUpdateToOneWithWhereWithoutEpisodeInput = {
    where?: PodcastWhereInput
    data: XOR<PodcastUpdateWithoutEpisodeInput, PodcastUncheckedUpdateWithoutEpisodeInput>
  }

  export type PodcastUpdateWithoutEpisodeInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUpdateManyWithoutPodcastNestedInput
    user?: UserUpdateOneWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateWithoutEpisodeInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutPodcastNestedInput
  }

  export type UserCurationProfileUpsertWithoutEpisodeInput = {
    update: XOR<UserCurationProfileUpdateWithoutEpisodeInput, UserCurationProfileUncheckedUpdateWithoutEpisodeInput>
    create: XOR<UserCurationProfileCreateWithoutEpisodeInput, UserCurationProfileUncheckedCreateWithoutEpisodeInput>
    where?: UserCurationProfileWhereInput
  }

  export type UserCurationProfileUpdateToOneWithWhereWithoutEpisodeInput = {
    where?: UserCurationProfileWhereInput
    data: XOR<UserCurationProfileUpdateWithoutEpisodeInput, UserCurationProfileUncheckedUpdateWithoutEpisodeInput>
  }

  export type UserCurationProfileUpdateWithoutEpisodeInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    profile_podcast?: ProfilePodcastUpdateManyWithoutUser_curation_profileNestedInput
    bundle?: BundleUpdateOneWithoutUser_curation_profileNestedInput
    user?: UserUpdateOneRequiredWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateWithoutEpisodeInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    selected_bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileNestedInput
  }

  export type EpisodeFeedbackUpsertWithWhereUniqueWithoutEpisodeInput = {
    where: EpisodeFeedbackWhereUniqueInput
    update: XOR<EpisodeFeedbackUpdateWithoutEpisodeInput, EpisodeFeedbackUncheckedUpdateWithoutEpisodeInput>
    create: XOR<EpisodeFeedbackCreateWithoutEpisodeInput, EpisodeFeedbackUncheckedCreateWithoutEpisodeInput>
  }

  export type EpisodeFeedbackUpdateWithWhereUniqueWithoutEpisodeInput = {
    where: EpisodeFeedbackWhereUniqueInput
    data: XOR<EpisodeFeedbackUpdateWithoutEpisodeInput, EpisodeFeedbackUncheckedUpdateWithoutEpisodeInput>
  }

  export type EpisodeFeedbackUpdateManyWithWhereWithoutEpisodeInput = {
    where: EpisodeFeedbackScalarWhereInput
    data: XOR<EpisodeFeedbackUpdateManyMutationInput, EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeInput>
  }

  export type EpisodeFeedbackScalarWhereInput = {
    AND?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
    OR?: EpisodeFeedbackScalarWhereInput[]
    NOT?: EpisodeFeedbackScalarWhereInput | EpisodeFeedbackScalarWhereInput[]
    feedback_id?: StringFilter<"EpisodeFeedback"> | string
    userId?: StringFilter<"EpisodeFeedback"> | string
    episodeId?: StringFilter<"EpisodeFeedback"> | string
    rating?: EnumFeedbackRatingFilter<"EpisodeFeedback"> | $Enums.FeedbackRating
    createdAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"EpisodeFeedback"> | Date | string
  }

  export type UserCreateWithoutNotificationInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
  }

  export type UserUpsertWithoutNotificationInput = {
    update: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type UserUpdateWithoutNotificationInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type BundlePodcastCreateWithoutPodcastInput = {
    bundle: BundleCreateNestedOneWithoutBundle_podcastInput
  }

  export type BundlePodcastUncheckedCreateWithoutPodcastInput = {
    bundle_id: string
  }

  export type BundlePodcastCreateOrConnectWithoutPodcastInput = {
    where: BundlePodcastWhereUniqueInput
    create: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput>
  }

  export type BundlePodcastCreateManyPodcastInputEnvelope = {
    data: BundlePodcastCreateManyPodcastInput | BundlePodcastCreateManyPodcastInput[]
    skipDuplicates?: boolean
  }

  export type EpisodeCreateWithoutPodcastInput = {
    episode_id: string
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    bundle?: BundleCreateNestedOneWithoutEpisodeInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutEpisodeInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeUncheckedCreateWithoutPodcastInput = {
    episode_id: string
    profile_id?: string | null
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeCreateOrConnectWithoutPodcastInput = {
    where: EpisodeWhereUniqueInput
    create: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput>
  }

  export type EpisodeCreateManyPodcastInputEnvelope = {
    data: EpisodeCreateManyPodcastInput | EpisodeCreateManyPodcastInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutPodcastInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPodcastInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPodcastInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPodcastInput, UserUncheckedCreateWithoutPodcastInput>
  }

  export type ProfilePodcastCreateWithoutPodcastInput = {
    user_curation_profile: UserCurationProfileCreateNestedOneWithoutProfile_podcastInput
  }

  export type ProfilePodcastUncheckedCreateWithoutPodcastInput = {
    profile_id: string
  }

  export type ProfilePodcastCreateOrConnectWithoutPodcastInput = {
    where: ProfilePodcastWhereUniqueInput
    create: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput>
  }

  export type ProfilePodcastCreateManyPodcastInputEnvelope = {
    data: ProfilePodcastCreateManyPodcastInput | ProfilePodcastCreateManyPodcastInput[]
    skipDuplicates?: boolean
  }

  export type BundlePodcastUpsertWithWhereUniqueWithoutPodcastInput = {
    where: BundlePodcastWhereUniqueInput
    update: XOR<BundlePodcastUpdateWithoutPodcastInput, BundlePodcastUncheckedUpdateWithoutPodcastInput>
    create: XOR<BundlePodcastCreateWithoutPodcastInput, BundlePodcastUncheckedCreateWithoutPodcastInput>
  }

  export type BundlePodcastUpdateWithWhereUniqueWithoutPodcastInput = {
    where: BundlePodcastWhereUniqueInput
    data: XOR<BundlePodcastUpdateWithoutPodcastInput, BundlePodcastUncheckedUpdateWithoutPodcastInput>
  }

  export type BundlePodcastUpdateManyWithWhereWithoutPodcastInput = {
    where: BundlePodcastScalarWhereInput
    data: XOR<BundlePodcastUpdateManyMutationInput, BundlePodcastUncheckedUpdateManyWithoutPodcastInput>
  }

  export type EpisodeUpsertWithWhereUniqueWithoutPodcastInput = {
    where: EpisodeWhereUniqueInput
    update: XOR<EpisodeUpdateWithoutPodcastInput, EpisodeUncheckedUpdateWithoutPodcastInput>
    create: XOR<EpisodeCreateWithoutPodcastInput, EpisodeUncheckedCreateWithoutPodcastInput>
  }

  export type EpisodeUpdateWithWhereUniqueWithoutPodcastInput = {
    where: EpisodeWhereUniqueInput
    data: XOR<EpisodeUpdateWithoutPodcastInput, EpisodeUncheckedUpdateWithoutPodcastInput>
  }

  export type EpisodeUpdateManyWithWhereWithoutPodcastInput = {
    where: EpisodeScalarWhereInput
    data: XOR<EpisodeUpdateManyMutationInput, EpisodeUncheckedUpdateManyWithoutPodcastInput>
  }

  export type UserUpsertWithoutPodcastInput = {
    update: XOR<UserUpdateWithoutPodcastInput, UserUncheckedUpdateWithoutPodcastInput>
    create: XOR<UserCreateWithoutPodcastInput, UserUncheckedCreateWithoutPodcastInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPodcastInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPodcastInput, UserUncheckedUpdateWithoutPodcastInput>
  }

  export type UserUpdateWithoutPodcastInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPodcastInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ProfilePodcastUpsertWithWhereUniqueWithoutPodcastInput = {
    where: ProfilePodcastWhereUniqueInput
    update: XOR<ProfilePodcastUpdateWithoutPodcastInput, ProfilePodcastUncheckedUpdateWithoutPodcastInput>
    create: XOR<ProfilePodcastCreateWithoutPodcastInput, ProfilePodcastUncheckedCreateWithoutPodcastInput>
  }

  export type ProfilePodcastUpdateWithWhereUniqueWithoutPodcastInput = {
    where: ProfilePodcastWhereUniqueInput
    data: XOR<ProfilePodcastUpdateWithoutPodcastInput, ProfilePodcastUncheckedUpdateWithoutPodcastInput>
  }

  export type ProfilePodcastUpdateManyWithWhereWithoutPodcastInput = {
    where: ProfilePodcastScalarWhereInput
    data: XOR<ProfilePodcastUpdateManyMutationInput, ProfilePodcastUncheckedUpdateManyWithoutPodcastInput>
  }

  export type ProfilePodcastScalarWhereInput = {
    AND?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
    OR?: ProfilePodcastScalarWhereInput[]
    NOT?: ProfilePodcastScalarWhereInput | ProfilePodcastScalarWhereInput[]
    profile_id?: StringFilter<"ProfilePodcast"> | string
    podcast_id?: StringFilter<"ProfilePodcast"> | string
  }

  export type PodcastCreateWithoutProfile_podcastInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutPodcastInput
    episode?: EpisodeCreateNestedManyWithoutPodcastInput
    user?: UserCreateNestedOneWithoutPodcastInput
  }

  export type PodcastUncheckedCreateWithoutProfile_podcastInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutPodcastInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutPodcastInput
  }

  export type PodcastCreateOrConnectWithoutProfile_podcastInput = {
    where: PodcastWhereUniqueInput
    create: XOR<PodcastCreateWithoutProfile_podcastInput, PodcastUncheckedCreateWithoutProfile_podcastInput>
  }

  export type UserCurationProfileCreateWithoutProfile_podcastInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    episode?: EpisodeCreateNestedManyWithoutUser_curation_profileInput
    bundle?: BundleCreateNestedOneWithoutUser_curation_profileInput
    user: UserCreateNestedOneWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUncheckedCreateWithoutProfile_podcastInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: string | null
    episode?: EpisodeUncheckedCreateNestedManyWithoutUser_curation_profileInput
  }

  export type UserCurationProfileCreateOrConnectWithoutProfile_podcastInput = {
    where: UserCurationProfileWhereUniqueInput
    create: XOR<UserCurationProfileCreateWithoutProfile_podcastInput, UserCurationProfileUncheckedCreateWithoutProfile_podcastInput>
  }

  export type PodcastUpsertWithoutProfile_podcastInput = {
    update: XOR<PodcastUpdateWithoutProfile_podcastInput, PodcastUncheckedUpdateWithoutProfile_podcastInput>
    create: XOR<PodcastCreateWithoutProfile_podcastInput, PodcastUncheckedCreateWithoutProfile_podcastInput>
    where?: PodcastWhereInput
  }

  export type PodcastUpdateToOneWithWhereWithoutProfile_podcastInput = {
    where?: PodcastWhereInput
    data: XOR<PodcastUpdateWithoutProfile_podcastInput, PodcastUncheckedUpdateWithoutProfile_podcastInput>
  }

  export type PodcastUpdateWithoutProfile_podcastInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUpdateManyWithoutPodcastNestedInput
    user?: UserUpdateOneWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateWithoutProfile_podcastInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutPodcastNestedInput
  }

  export type UserCurationProfileUpsertWithoutProfile_podcastInput = {
    update: XOR<UserCurationProfileUpdateWithoutProfile_podcastInput, UserCurationProfileUncheckedUpdateWithoutProfile_podcastInput>
    create: XOR<UserCurationProfileCreateWithoutProfile_podcastInput, UserCurationProfileUncheckedCreateWithoutProfile_podcastInput>
    where?: UserCurationProfileWhereInput
  }

  export type UserCurationProfileUpdateToOneWithWhereWithoutProfile_podcastInput = {
    where?: UserCurationProfileWhereInput
    data: XOR<UserCurationProfileUpdateWithoutProfile_podcastInput, UserCurationProfileUncheckedUpdateWithoutProfile_podcastInput>
  }

  export type UserCurationProfileUpdateWithoutProfile_podcastInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    episode?: EpisodeUpdateManyWithoutUser_curation_profileNestedInput
    bundle?: BundleUpdateOneWithoutUser_curation_profileNestedInput
    user?: UserUpdateOneRequiredWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateWithoutProfile_podcastInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    selected_bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    episode?: EpisodeUncheckedUpdateManyWithoutUser_curation_profileNestedInput
  }

  export type UserCreateWithoutSubscriptionInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type BundleCreateWithoutUserInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutBundleInput
    episode?: EpisodeCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutUserInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutBundleInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutBundleInput
    user_curation_profile?: UserCurationProfileUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutUserInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput>
  }

  export type BundleCreateManyUserInputEnvelope = {
    data: BundleCreateManyUserInput | BundleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EpisodeFeedbackCreateWithoutUserInput = {
    feedback_id: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
    episode: EpisodeCreateNestedOneWithoutFeedbackInput
  }

  export type EpisodeFeedbackUncheckedCreateWithoutUserInput = {
    feedback_id: string
    episodeId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EpisodeFeedbackCreateOrConnectWithoutUserInput = {
    where: EpisodeFeedbackWhereUniqueInput
    create: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput>
  }

  export type EpisodeFeedbackCreateManyUserInputEnvelope = {
    data: EpisodeFeedbackCreateManyUserInput | EpisodeFeedbackCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    notification_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    notification_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PodcastCreateWithoutUserInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutPodcastInput
    episode?: EpisodeCreateNestedManyWithoutPodcastInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutPodcastInput
  }

  export type PodcastUncheckedCreateWithoutUserInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutPodcastInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutPodcastInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutPodcastInput
  }

  export type PodcastCreateOrConnectWithoutUserInput = {
    where: PodcastWhereUniqueInput
    create: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput>
  }

  export type PodcastCreateManyUserInputEnvelope = {
    data: PodcastCreateManyUserInput | PodcastCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    subscription_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    subscription_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: SubscriptionCreateManyUserInput | SubscriptionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserCurationProfileCreateWithoutUserInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    episode?: EpisodeCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastCreateNestedManyWithoutUser_curation_profileInput
    bundle?: BundleCreateNestedOneWithoutUser_curation_profileInput
  }

  export type UserCurationProfileUncheckedCreateWithoutUserInput = {
    profile_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
    selected_bundle_id?: string | null
    episode?: EpisodeUncheckedCreateNestedManyWithoutUser_curation_profileInput
    profile_podcast?: ProfilePodcastUncheckedCreateNestedManyWithoutUser_curation_profileInput
  }

  export type UserCurationProfileCreateOrConnectWithoutUserInput = {
    where: UserCurationProfileWhereUniqueInput
    create: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
  }

  export type BundleUpsertWithWhereUniqueWithoutUserInput = {
    where: BundleWhereUniqueInput
    update: XOR<BundleUpdateWithoutUserInput, BundleUncheckedUpdateWithoutUserInput>
    create: XOR<BundleCreateWithoutUserInput, BundleUncheckedCreateWithoutUserInput>
  }

  export type BundleUpdateWithWhereUniqueWithoutUserInput = {
    where: BundleWhereUniqueInput
    data: XOR<BundleUpdateWithoutUserInput, BundleUncheckedUpdateWithoutUserInput>
  }

  export type BundleUpdateManyWithWhereWithoutUserInput = {
    where: BundleScalarWhereInput
    data: XOR<BundleUpdateManyMutationInput, BundleUncheckedUpdateManyWithoutUserInput>
  }

  export type BundleScalarWhereInput = {
    AND?: BundleScalarWhereInput | BundleScalarWhereInput[]
    OR?: BundleScalarWhereInput[]
    NOT?: BundleScalarWhereInput | BundleScalarWhereInput[]
    bundle_id?: StringFilter<"Bundle"> | string
    name?: StringFilter<"Bundle"> | string
    description?: StringNullableFilter<"Bundle"> | string | null
    image_url?: StringNullableFilter<"Bundle"> | string | null
    is_static?: BoolFilter<"Bundle"> | boolean
    is_active?: BoolFilter<"Bundle"> | boolean
    owner_user_id?: StringNullableFilter<"Bundle"> | string | null
    created_at?: DateTimeFilter<"Bundle"> | Date | string
  }

  export type EpisodeFeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: EpisodeFeedbackWhereUniqueInput
    update: XOR<EpisodeFeedbackUpdateWithoutUserInput, EpisodeFeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<EpisodeFeedbackCreateWithoutUserInput, EpisodeFeedbackUncheckedCreateWithoutUserInput>
  }

  export type EpisodeFeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: EpisodeFeedbackWhereUniqueInput
    data: XOR<EpisodeFeedbackUpdateWithoutUserInput, EpisodeFeedbackUncheckedUpdateWithoutUserInput>
  }

  export type EpisodeFeedbackUpdateManyWithWhereWithoutUserInput = {
    where: EpisodeFeedbackScalarWhereInput
    data: XOR<EpisodeFeedbackUpdateManyMutationInput, EpisodeFeedbackUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    notification_id?: StringFilter<"Notification"> | string
    user_id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
  }

  export type PodcastUpsertWithWhereUniqueWithoutUserInput = {
    where: PodcastWhereUniqueInput
    update: XOR<PodcastUpdateWithoutUserInput, PodcastUncheckedUpdateWithoutUserInput>
    create: XOR<PodcastCreateWithoutUserInput, PodcastUncheckedCreateWithoutUserInput>
  }

  export type PodcastUpdateWithWhereUniqueWithoutUserInput = {
    where: PodcastWhereUniqueInput
    data: XOR<PodcastUpdateWithoutUserInput, PodcastUncheckedUpdateWithoutUserInput>
  }

  export type PodcastUpdateManyWithWhereWithoutUserInput = {
    where: PodcastScalarWhereInput
    data: XOR<PodcastUpdateManyMutationInput, PodcastUncheckedUpdateManyWithoutUserInput>
  }

  export type PodcastScalarWhereInput = {
    AND?: PodcastScalarWhereInput | PodcastScalarWhereInput[]
    OR?: PodcastScalarWhereInput[]
    NOT?: PodcastScalarWhereInput | PodcastScalarWhereInput[]
    podcast_id?: StringFilter<"Podcast"> | string
    name?: StringFilter<"Podcast"> | string
    description?: StringNullableFilter<"Podcast"> | string | null
    url?: StringFilter<"Podcast"> | string
    image_url?: StringNullableFilter<"Podcast"> | string | null
    category?: StringNullableFilter<"Podcast"> | string | null
    is_active?: BoolFilter<"Podcast"> | boolean
    owner_user_id?: StringNullableFilter<"Podcast"> | string | null
    created_at?: DateTimeFilter<"Podcast"> | Date | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    subscription_id?: StringFilter<"Subscription"> | string
    user_id?: StringFilter<"Subscription"> | string
    link_customer_id?: StringNullableFilter<"Subscription"> | string | null
    link_subscription_id?: StringNullableFilter<"Subscription"> | string | null
    link_price_id?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    current_period_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    current_period_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trail_start?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trial_end?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    canceled_at?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    created_at?: DateTimeFilter<"Subscription"> | Date | string
    updated_at?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type UserCurationProfileUpsertWithoutUserInput = {
    update: XOR<UserCurationProfileUpdateWithoutUserInput, UserCurationProfileUncheckedUpdateWithoutUserInput>
    create: XOR<UserCurationProfileCreateWithoutUserInput, UserCurationProfileUncheckedCreateWithoutUserInput>
    where?: UserCurationProfileWhereInput
  }

  export type UserCurationProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: UserCurationProfileWhereInput
    data: XOR<UserCurationProfileUpdateWithoutUserInput, UserCurationProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserCurationProfileUpdateWithoutUserInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    episode?: EpisodeUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutUser_curation_profileNestedInput
    bundle?: BundleUpdateOneWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateWithoutUserInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    selected_bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    episode?: EpisodeUncheckedUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileNestedInput
  }

  export type EpisodeCreateWithoutUser_curation_profileInput = {
    episode_id: string
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    bundle?: BundleCreateNestedOneWithoutEpisodeInput
    podcast: PodcastCreateNestedOneWithoutEpisodeInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeUncheckedCreateWithoutUser_curation_profileInput = {
    episode_id: string
    podcast_id: string
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutEpisodeInput
  }

  export type EpisodeCreateOrConnectWithoutUser_curation_profileInput = {
    where: EpisodeWhereUniqueInput
    create: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type EpisodeCreateManyUser_curation_profileInputEnvelope = {
    data: EpisodeCreateManyUser_curation_profileInput | EpisodeCreateManyUser_curation_profileInput[]
    skipDuplicates?: boolean
  }

  export type ProfilePodcastCreateWithoutUser_curation_profileInput = {
    podcast: PodcastCreateNestedOneWithoutProfile_podcastInput
  }

  export type ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput = {
    podcast_id: string
  }

  export type ProfilePodcastCreateOrConnectWithoutUser_curation_profileInput = {
    where: ProfilePodcastWhereUniqueInput
    create: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type ProfilePodcastCreateManyUser_curation_profileInputEnvelope = {
    data: ProfilePodcastCreateManyUser_curation_profileInput | ProfilePodcastCreateManyUser_curation_profileInput[]
    skipDuplicates?: boolean
  }

  export type BundleCreateWithoutUser_curation_profileInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutBundleInput
    bundle_podcast?: BundlePodcastCreateNestedManyWithoutBundleInput
    episode?: EpisodeCreateNestedManyWithoutBundleInput
  }

  export type BundleUncheckedCreateWithoutUser_curation_profileInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    owner_user_id?: string | null
    created_at?: Date | string
    bundle_podcast?: BundlePodcastUncheckedCreateNestedManyWithoutBundleInput
    episode?: EpisodeUncheckedCreateNestedManyWithoutBundleInput
  }

  export type BundleCreateOrConnectWithoutUser_curation_profileInput = {
    where: BundleWhereUniqueInput
    create: XOR<BundleCreateWithoutUser_curation_profileInput, BundleUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type UserCreateWithoutUser_curation_profileInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackCreateNestedManyWithoutUserInput
    notification?: NotificationCreateNestedManyWithoutUserInput
    podcast?: PodcastCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUser_curation_profileInput = {
    user_id: string
    name?: string | null
    email: string
    password: string
    image?: string | null
    email_verified?: Date | string | null
    is_admin?: boolean
    email_notifications?: boolean
    in_app_notifications?: boolean
    created_at?: Date | string
    updated_at: Date | string
    bundle?: BundleUncheckedCreateNestedManyWithoutUserInput
    feedback?: EpisodeFeedbackUncheckedCreateNestedManyWithoutUserInput
    notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    podcast?: PodcastUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUser_curation_profileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUser_curation_profileInput, UserUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type EpisodeUpsertWithWhereUniqueWithoutUser_curation_profileInput = {
    where: EpisodeWhereUniqueInput
    update: XOR<EpisodeUpdateWithoutUser_curation_profileInput, EpisodeUncheckedUpdateWithoutUser_curation_profileInput>
    create: XOR<EpisodeCreateWithoutUser_curation_profileInput, EpisodeUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type EpisodeUpdateWithWhereUniqueWithoutUser_curation_profileInput = {
    where: EpisodeWhereUniqueInput
    data: XOR<EpisodeUpdateWithoutUser_curation_profileInput, EpisodeUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type EpisodeUpdateManyWithWhereWithoutUser_curation_profileInput = {
    where: EpisodeScalarWhereInput
    data: XOR<EpisodeUpdateManyMutationInput, EpisodeUncheckedUpdateManyWithoutUser_curation_profileInput>
  }

  export type ProfilePodcastUpsertWithWhereUniqueWithoutUser_curation_profileInput = {
    where: ProfilePodcastWhereUniqueInput
    update: XOR<ProfilePodcastUpdateWithoutUser_curation_profileInput, ProfilePodcastUncheckedUpdateWithoutUser_curation_profileInput>
    create: XOR<ProfilePodcastCreateWithoutUser_curation_profileInput, ProfilePodcastUncheckedCreateWithoutUser_curation_profileInput>
  }

  export type ProfilePodcastUpdateWithWhereUniqueWithoutUser_curation_profileInput = {
    where: ProfilePodcastWhereUniqueInput
    data: XOR<ProfilePodcastUpdateWithoutUser_curation_profileInput, ProfilePodcastUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type ProfilePodcastUpdateManyWithWhereWithoutUser_curation_profileInput = {
    where: ProfilePodcastScalarWhereInput
    data: XOR<ProfilePodcastUpdateManyMutationInput, ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileInput>
  }

  export type BundleUpsertWithoutUser_curation_profileInput = {
    update: XOR<BundleUpdateWithoutUser_curation_profileInput, BundleUncheckedUpdateWithoutUser_curation_profileInput>
    create: XOR<BundleCreateWithoutUser_curation_profileInput, BundleUncheckedCreateWithoutUser_curation_profileInput>
    where?: BundleWhereInput
  }

  export type BundleUpdateToOneWithWhereWithoutUser_curation_profileInput = {
    where?: BundleWhereInput
    data: XOR<BundleUpdateWithoutUser_curation_profileInput, BundleUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type BundleUpdateWithoutUser_curation_profileInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutBundleNestedInput
    bundle_podcast?: BundlePodcastUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutUser_curation_profileInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    owner_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type UserUpsertWithoutUser_curation_profileInput = {
    update: XOR<UserUpdateWithoutUser_curation_profileInput, UserUncheckedUpdateWithoutUser_curation_profileInput>
    create: XOR<UserCreateWithoutUser_curation_profileInput, UserUncheckedCreateWithoutUser_curation_profileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUser_curation_profileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUser_curation_profileInput, UserUncheckedUpdateWithoutUser_curation_profileInput>
  }

  export type UserUpdateWithoutUser_curation_profileInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutUserNestedInput
    notification?: NotificationUpdateManyWithoutUserNestedInput
    podcast?: PodcastUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUser_curation_profileInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    email_verified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_admin?: BoolFieldUpdateOperationsInput | boolean
    email_notifications?: BoolFieldUpdateOperationsInput | boolean
    in_app_notifications?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUncheckedUpdateManyWithoutUserNestedInput
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutUserNestedInput
    notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    podcast?: PodcastUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BundlePodcastCreateManyBundleInput = {
    podcast_id: string
  }

  export type EpisodeCreateManyBundleInput = {
    episode_id: string
    podcast_id: string
    profile_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
  }

  export type UserCurationProfileCreateManyBundleInput = {
    profile_id: string
    user_id: string
    name: string
    status?: string
    audio_url?: string | null
    image_url?: string | null
    created_at?: Date | string
    updated_at: Date | string
    generated_at?: Date | string | null
    last_generation_date?: Date | string | null
    next_generation_date?: Date | string | null
    is_active?: boolean
    is_bundle_selection?: boolean
  }

  export type BundlePodcastUpdateWithoutBundleInput = {
    podcast?: PodcastUpdateOneRequiredWithoutBundle_podcastNestedInput
  }

  export type BundlePodcastUncheckedUpdateWithoutBundleInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type BundlePodcastUncheckedUpdateManyWithoutBundleInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type EpisodeUpdateWithoutBundleInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    podcast?: PodcastUpdateOneRequiredWithoutEpisodeNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutEpisodeNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateWithoutBundleInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateManyWithoutBundleInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCurationProfileUpdateWithoutBundleInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    episode?: EpisodeUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutUser_curation_profileNestedInput
    user?: UserUpdateOneRequiredWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateWithoutBundleInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
    episode?: EpisodeUncheckedUpdateManyWithoutUser_curation_profileNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileNestedInput
  }

  export type UserCurationProfileUncheckedUpdateManyWithoutBundleInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    audio_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    next_generation_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    is_bundle_selection?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EpisodeFeedbackCreateManyEpisodeInput = {
    feedback_id: string
    userId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EpisodeFeedbackUpdateWithoutEpisodeInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type EpisodeFeedbackUncheckedUpdateWithoutEpisodeInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BundlePodcastCreateManyPodcastInput = {
    bundle_id: string
  }

  export type EpisodeCreateManyPodcastInput = {
    episode_id: string
    profile_id?: string | null
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
  }

  export type ProfilePodcastCreateManyPodcastInput = {
    profile_id: string
  }

  export type BundlePodcastUpdateWithoutPodcastInput = {
    bundle?: BundleUpdateOneRequiredWithoutBundle_podcastNestedInput
  }

  export type BundlePodcastUncheckedUpdateWithoutPodcastInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
  }

  export type BundlePodcastUncheckedUpdateManyWithoutPodcastInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
  }

  export type EpisodeUpdateWithoutPodcastInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneWithoutEpisodeNestedInput
    user_curation_profile?: UserCurationProfileUpdateOneWithoutEpisodeNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateWithoutPodcastInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateManyWithoutPodcastInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    profile_id?: NullableStringFieldUpdateOperationsInput | string | null
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePodcastUpdateWithoutPodcastInput = {
    user_curation_profile?: UserCurationProfileUpdateOneRequiredWithoutProfile_podcastNestedInput
  }

  export type ProfilePodcastUncheckedUpdateWithoutPodcastInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProfilePodcastUncheckedUpdateManyWithoutPodcastInput = {
    profile_id?: StringFieldUpdateOperationsInput | string
  }

  export type BundleCreateManyUserInput = {
    bundle_id: string
    name: string
    description?: string | null
    image_url?: string | null
    is_static?: boolean
    is_active?: boolean
    created_at?: Date | string
  }

  export type EpisodeFeedbackCreateManyUserInput = {
    feedback_id: string
    episodeId: string
    rating: $Enums.FeedbackRating
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    notification_id: string
    type: string
    message: string
    is_read?: boolean
    created_at?: Date | string
  }

  export type PodcastCreateManyUserInput = {
    podcast_id: string
    name: string
    description?: string | null
    url: string
    image_url?: string | null
    category?: string | null
    is_active?: boolean
    created_at?: Date | string
  }

  export type SubscriptionCreateManyUserInput = {
    subscription_id: string
    link_customer_id?: string | null
    link_subscription_id?: string | null
    link_price_id?: string | null
    status?: string
    current_period_start?: Date | string | null
    current_period_end?: Date | string | null
    trail_start?: Date | string | null
    trial_end?: Date | string | null
    canceled_at?: Date | string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type BundleUpdateWithoutUserInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateWithoutUserInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutBundleNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutBundleNestedInput
    user_curation_profile?: UserCurationProfileUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type BundleUncheckedUpdateManyWithoutUserInput = {
    bundle_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_static?: BoolFieldUpdateOperationsInput | boolean
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeFeedbackUpdateWithoutUserInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    episode?: EpisodeUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type EpisodeFeedbackUncheckedUpdateWithoutUserInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    episodeId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeFeedbackUncheckedUpdateManyWithoutUserInput = {
    feedback_id?: StringFieldUpdateOperationsInput | string
    episodeId?: StringFieldUpdateOperationsInput | string
    rating?: EnumFeedbackRatingFieldUpdateOperationsInput | $Enums.FeedbackRating
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PodcastUpdateWithoutUserInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUpdateManyWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateWithoutUserInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle_podcast?: BundlePodcastUncheckedUpdateManyWithoutPodcastNestedInput
    episode?: EpisodeUncheckedUpdateManyWithoutPodcastNestedInput
    profile_podcast?: ProfilePodcastUncheckedUpdateManyWithoutPodcastNestedInput
  }

  export type PodcastUncheckedUpdateManyWithoutUserInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUpdateWithoutUserInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    subscription_id?: StringFieldUpdateOperationsInput | string
    link_customer_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_subscription_id?: NullableStringFieldUpdateOperationsInput | string | null
    link_price_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    current_period_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    current_period_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trail_start?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trial_end?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EpisodeCreateManyUser_curation_profileInput = {
    episode_id: string
    podcast_id: string
    bundle_id?: string | null
    title: string
    description?: string | null
    audio_url: string
    image_url?: string | null
    published_at?: Date | string | null
    week_nr?: Date | string | null
    created_at?: Date | string
  }

  export type ProfilePodcastCreateManyUser_curation_profileInput = {
    podcast_id: string
  }

  export type EpisodeUpdateWithoutUser_curation_profileInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: BundleUpdateOneWithoutEpisodeNestedInput
    podcast?: PodcastUpdateOneRequiredWithoutEpisodeNestedInput
    feedback?: EpisodeFeedbackUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateWithoutUser_curation_profileInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: EpisodeFeedbackUncheckedUpdateManyWithoutEpisodeNestedInput
  }

  export type EpisodeUncheckedUpdateManyWithoutUser_curation_profileInput = {
    episode_id?: StringFieldUpdateOperationsInput | string
    podcast_id?: StringFieldUpdateOperationsInput | string
    bundle_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    audio_url?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    week_nr?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfilePodcastUpdateWithoutUser_curation_profileInput = {
    podcast?: PodcastUpdateOneRequiredWithoutProfile_podcastNestedInput
  }

  export type ProfilePodcastUncheckedUpdateWithoutUser_curation_profileInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProfilePodcastUncheckedUpdateManyWithoutUser_curation_profileInput = {
    podcast_id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}