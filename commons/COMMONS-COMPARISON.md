# Commons package comparison: file names, method names, method contents

Comparison across **Java**, **.NET**, and **TypeScript** commons (same repo family). Covers file names, public method/API names, and method content/behavior.

---

## 1. DSL

### 1.1 UseCaseContext

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **File** | UseCaseContext.java | UseCaseContext.cs | UseCaseContext.ts |
| **Constructor** | `UseCaseContext(ExternalSystemMode)` (required) | `UseCaseContext(ExternalSystemMode)` (required) | `UseCaseContext(externalSystemMode?)` (optional, default REAL) |
| **Methods** | getExternalSystemMode, getParamValue, getParamValueOrLiteral, setResultEntry, setResultEntryFailed, getResultValue, expandAliases | GetParamValue, GetParamValueOrLiteral, SetResultEntry, SetResultEntryFailed, GetResultValue, ExpandAliases; property ExternalSystemMode | Same names (getParamValue, getParamValueOrLiteral, setResultEntry, setResultEntryFailed, getResultValue, expandAliases) |

**Method content (behavior):**

- **getParamValue:** All: if alias null/blank return as-is; if in map return; else generate (alias + short UUID), store, return. Same logic.
- **getParamValueOrLiteral:** STUB → getParamValue(alias); REAL → alias. Same.
- **setResultEntry:** Ensure alias not null/blank; throw if alias exists; put. Same.
- **setResultEntryFailed:** setResultEntry(alias, "FAILED: " + errorMessage). Same.
- **getResultValue:** If alias null/blank return as-is; if value contains "FAILED" throw; else return value or alias. Same.
- **expandAliases:** Replace each param/result map entry in message. Same.

**Synced:** TS constructor now requires `externalSystemMode` (no default), matching Java/.NET.

---

### 1.2 UseCase / BaseUseCase / UseCaseResult

| Type | Java | .NET | TypeScript |
|------|------|------|------------|
| **UseCase** | interface `execute() → TResult` | IUseCase `Execute() → Task<TResult>` | interface `execute(): Promise<TResult>` |
| **BaseUseCase** | abstract, driver + context, `execute()` | Same | Same |
| **UseCaseResult** | constructor(result, context, verificationFactory, failureVerificationFactory); shouldSucceed(), shouldFail() | Same (ShouldSucceed, ShouldFail) | Same (shouldSucceed, shouldFail) |

**Method content:** Same intent: shouldSucceed throws if failure and returns verification from factory; shouldFail throws if success and returns failure verification from factory.

---

### 1.3 ResponseVerification / VoidVerification

| Type | Java | .NET | TypeScript |
|------|------|------|------------|
| **ResponseVerification** | constructor(response, context); getResponse(), getContext() | Same | Same (getResponse, getContext) |
| **VoidVerification** | extends ResponseVerification&lt;Void, …&gt; | Same (VoidValue) | extends ResponseVerification&lt;void, …&gt; |

Content aligned: hold response + context; expose getters.

---

### 1.4 ExternalSystemMode

Enum: STUB, REAL in all three. Same.

---

## 2. HTTP folder

### 2.1 File list

| Java (commons/http) | .NET (Commons/Http) | TypeScript (commons/src/http) |
|---------------------|---------------------|--------------------------------|
| HttpStatus.java     | HttpStatus.cs       | HttpStatus.ts                  |
| JsonHttpClient.java | JsonHttpClient.cs   | JsonHttpClient.ts              |
| —                   | —                   | index.ts                       |

All three have only **HttpStatus** and **JsonHttpClient** (plus index.ts barrel in TS).

### 2.2 HttpStatus

| Constant              | Java | .NET | TypeScript |
|-----------------------|------|------|------------|
| OK                    | 200  | Ok = 200 | OK: 200 |
| CREATED               | 201  | Created = 201 | CREATED: 201 |
| ACCEPTED              | 202  | Accepted = 202 | ACCEPTED: 202 |
| NO_CONTENT            | 204  | NoContent = 204 | NO_CONTENT: 204 |
| BAD_REQUEST … 503     | same | same | same (BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR, BAD_GATEWAY, SERVICE_UNAVAILABLE) |

Java uses `static final int`; .NET uses `public const int`; TypeScript uses `as const` object. Same numeric values and names (casing: Java/TS UPPER_SNAKE, .NET PascalCase).

### 2.3 JsonHttpClient

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **Constructor** | `(HttpClient, baseUrl, Class<E> errorType, ObjectMapper)` or `(baseUrl, Class<E> errorType)` | `(baseUrl)` only; E is generic on class | `(baseUrl)` only; E is generic on class (required) |
| **Close/Dispose** | `close()` (AutoCloseable), closes HttpClient | `Dispose()` (IDisposable) | No close; gateway holds Axios instance |
| **GET** | `get(path, Class<T>)` → Result&lt;T,E&gt;; `get(path)` → Result&lt;Void,E&gt; | `GetAsync<T>(path)`; `GetAsync(path)` → Result&lt;VoidValue,E&gt; | `getAsync<T>(path)`; `getAsync<void>(path)` → Result&lt;void,E&gt; |
| **POST** | `post(path, request, Class<T>)`; etc. | `PostAsync<T>(path, request)`; `PostAsync(path, request)` | `postAsync<T>(path, request)`; `postAsync<void>(path, request)` |
| **PUT** | `put(path, request, Class<T>)`; `put(path, request)` | `PutAsync<T>(path, request)`; `PutAsync(path, request)` | `putAsync<T>(path, request)`; `putAsync<void>(path, request)` |
| **DELETE** | `delete(path, Class<T>)`; `delete(path)` | `DeleteAsync<T>(path)`; `DeleteAsync(path)` | `deleteAsync<T>(path)`; `deleteAsync<void>(path)` |

**Method content (behavior):**

- All three: build request (GET/POST/PUT/DELETE), send, read status. If success (2xx) → deserialize body to T (or void) and return Result.success; if failure → deserialize body to E and return Result.failure.
- Java: sync API; uses virtual thread executor to run HTTP call. Requires `Class<E>` for error deserialization. Uses Spring `HttpStatus.valueOf(statusCode).is2xxSuccessful()`.
- .NET: async (Task). Uses `HttpResponseMessage.IsSuccessStatusCode`. Void responses use `VoidValue`.
- TypeScript: async (Promise). Uses Axios directly inside JsonHttpClient; maps status to Result success/failure inline. Error type E is generic; error body is parsed as E (or a minimal object with status/title/detail).

**Differences:**

- Java constructor requires **error type** (Class&lt;E&gt;) and optionally HttpClient + ObjectMapper; .NET/TS only need baseUrl (and E from type parameter).
- TS has no built-in close/dispose; Axios instance is not closed by JsonHttpClient (could be added if needed).
- Naming: Java/.NET use overloads; .NET/TS use Async suffix for async methods (GetAsync, getAsync). TS uses same method with generic `getAsync<void>(path)` for no response body.

---

## 3. Playwright

### 3.1 PageClient

| Method (Java) | .NET | TypeScript | Content note |
|---------------|------|------------|---------------|
| fill(selector, value) | FillAsync(selector, text) | fillAsync(selector, text) | GetLocatorAsync / getLocatorAsync, then fill. null → ''. Same. |
| click(selector) | ClickAsync(selector) | clickAsync(selector) | GetLocatorAsync / getLocatorAsync, then click. Same. |
| readTextContent(selector) | ReadTextContentAsync(selector) | readTextContentAsync(selector) | Wait for locator, textContent. Same. |
| (none) | ReadTextContentImmediatelyAsync(selector) | readTextContentImmediatelyAsync(selector) | No wait; locator then textContent. .NET + TS. |
| readAllTextContents(selector) | ReadAllTextContentsAsync(selector) | readAllTextContentsAsync(selector) | Locator, first().waitFor(visible), then allTextContents. Same. |
| isVisible(selector) | IsVisibleAsync(selector) | isVisibleAsync(selector), existsAsync(selector) | getLocatorAsync, count &gt; 0; catch → false. existsAsync delegates to isVisibleAsync. |
| isHidden(selector) | IsHiddenAsync(selector) | isHiddenAsync(selector) | Locator (no wait), count === 0. Same. |

**Constructor:** Java (Page) or (Page, timeoutMs); .NET (IPage, baseUrl) with default timeout 30s; TS (Page, baseUrl, timeoutMs) default 30s. All use 30s default timeout. TS has getBaseUrl(), getPage().

**Locators:** Java: private getLocator(selector) / getLocator(selector, waitOptions), wait with state VISIBLE, throw if count 0. .NET: public GetLocator(selector) no wait; private GetLocatorAsync(selector) with state Visible, throw if count 0. TS: public getLocator(selector) no wait; private getLocatorAsync(selector) via getDefaultWaitForOptions() state visible, throw if count 0.

**TS-only methods (no Java/.NET):** readInputValueAsync, readInputIntegerValueAsync, readInputCurrencyDecimalValueAsync, readInputPercentageDecimalValueAsync, waitForHiddenAsync, waitForVisibleAsync. All async methods use Async suffix to match .NET.

**Method name equivalence (.NET ↔ TypeScript):** Same names, different casing (PascalCase → camelCase). Every .NET public method has an equivalent TS method:

| .NET | TypeScript | Equivalent? |
|------|------------|-------------|
| GetLocator(selector) | getLocator(selector) | Yes (sync; no wait) |
| FillAsync(selector, text) | fillAsync(selector, text) | Yes |
| ClickAsync(selector) | clickAsync(selector) | Yes |
| ReadTextContentAsync(selector) | readTextContentAsync(selector) | Yes |
| ReadTextContentImmediatelyAsync(selector) | readTextContentImmediatelyAsync(selector) | Yes |
| ReadAllTextContentsAsync(selector) | readAllTextContentsAsync(selector) | Yes |
| IsVisibleAsync(selector) | isVisibleAsync(selector) | Yes |
| IsHiddenAsync(selector) | isHiddenAsync(selector) | Yes |

TypeScript adds: getBaseUrl(), getPage(), existsAsync (alias for isVisibleAsync), readInputValueAsync, readInputIntegerValueAsync, readInputCurrencyDecimalValueAsync, readInputPercentageDecimalValueAsync, waitForHiddenAsync, waitForVisibleAsync. .NET has no equivalent for these; they are TS-only helpers.

---

## 4. Util

### 4.1 Closer

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **Method** | close(AutoCloseable) | (none in Commons) | close(closeable) |
| **Content** | if not null, try close(); on exception throw IllegalStateException | — | if closeable?.close, try await close(); on exception console.error (does not rethrow) |

**Synced:** TS now rethrows with cause (Error with cause) to match Java; supports both sync and async close().

### 4.2 Converter

| Method (Java) | .NET | TypeScript | Content |
|---------------|------|------------|---------|
| toBigDecimal(String), fromBigDecimal | ToDecimal, FromDecimal | toDecimal, fromDecimal | Parse/format number. TS uses number (no BigDecimal). Same intent. |
| toInteger(String, nullValues…), fromInteger | ToInteger(…), FromInteger | toInteger(…), fromInteger | Null/blank and nullValues → null; else parse. Same. |
| toDouble | (use ToDecimal) | toDouble | Parse double. Same. |
| toInstant, fromInstant | ToInstant, FromInstant | toInstant, fromInstant | ISO/date handling. Java Instant; .NET DateTime; TS Date. Same intent. |
| parseInstant(text, nullValues…) | ParseDateTime(…, nullValues) | toDate(…, nullValues) | Null/blank/nullValues → null; try ISO then locale formats. Same. |

Java also has toBigDecimal(double), fromDouble(double). TS uses toDecimal/fromDecimal for numeric string ↔ number. Method content (null handling, nullValues, parse) aligned.

### 4.3 Result&lt;T, E&gt;

| Method (Java) | .NET | TypeScript | Content |
|---------------|------|------------|---------|
| success(value), failure(error) | Success(value), Failure(error) | success(value?), failure(error) | Construct success/failure. Same. |
| isSuccess(), isFailure() | IsSuccess, IsFailure (properties) | isSuccess(), isFailure() | Same. |
| getValue(), getError() | Value, Error (properties) | getValue(), getError() | Throw if wrong state; return value or error. Same. |
| map(mapper) | Map(mapper) | map(mapper) | Success → map value; failure → pass through. Same. |
| mapError(mapper) | MapError(mapper) | mapError(mapper), mapFailure (deprecated alias) | Synced: mapError primary; mapFailure kept as alias. |
| mapVoid() | MapVoid() → Result&lt;VoidValue,E&gt; | mapVoid() → Result&lt;void,E&gt; | Success → void; failure → pass through. Same. |

**Content:** All use private constructor and same success/failure branching. .NET uses VoidValue; TS uses void. Same semantics.

### 4.4 ResultAssert / result matchers

| Java | .NET | TypeScript |
|------|------|------------|
| ResultAssert.assertThatResult(actual).isSuccess() / isFailure() | ResultAssertExtensions: ShouldBeSuccess(), ShouldBeFailure() | setupResultMatchers() then expect(result).toBeSuccess() / toBeFailureWith(msg) / toHaveErrorMessage(msg) / toHaveFieldError(msg) |

Different API shape (fluent assert vs expect matchers); same intent. TS uses Playwright/Jest-style matchers (idiomatic).

---

## 5. WireMock

### 5.1 JsonWireMockClient

| Method (Java) | .NET | TypeScript | Content |
|---------------|------|------------|---------|
| stubGet(path, statusCode, response) | StubGetAsync&lt;T&gt;(path, statusCode, response) | stubGet(path, statusCode, response) | Register GET stub with body. Same. |
| stubGet(path, statusCode) | StubGetAsync(path, statusCode) | stubGetNoBody(path, statusCode) | Register GET stub, no body. Same. |
| stubPost, stubPut, stubDelete (with/without body) | StubPostAsync, StubPutAsync, StubDeleteAsync (overloads) | stubPost, stubPostNoBody, stubPut, stubPutNoBody, stubDelete, stubDeleteNoBody | Same. |

**Method content:** All POST to __admin/mappings (or WireMock API), request method+urlPath, response status (+ optional body). Java uses virtual threads; .NET/TS async. Same behavior.

---

## 6. Summary table (method names only)

| Area | Java | .NET | TypeScript | Notes |
|------|------|------|------------|-------|
| UseCaseContext | getParamValue, getParamValueOrLiteral, setResultEntry, setResultEntryFailed, getResultValue, expandAliases | Same (PascalCase) | Same (camelCase) | Aligned. |
| Result | getValue, getError, map, mapError, mapVoid | Value, Error, Map, MapError, MapVoid | getValue, getError, map, mapError, mapVoid (+ mapFailure deprecated) | Synced. |
| PageClient | isVisible | IsVisibleAsync | isVisible, exists (alias) | Synced. |
| Converter | toBigDecimal, fromBigDecimal | ToDecimal, FromDecimal | toDecimal, fromDecimal | No BigDecimal in TS. |
| Closer | close (rethrow) | — | close (rethrow with cause) | Synced. |
| JsonHttpClient | get(path, type), get(path) | GetAsync&lt;T&gt;, GetAsync | getAsync&lt;T&gt;, getAsync&lt;void&gt;, postAsync, putAsync, deleteAsync | Same capabilities. |
| JsonWireMockClient | stubGet(path, code, body), stubGet(path, code) | StubGetAsync&lt;T&gt;, StubGetAsync | stubGet, stubGetNoBody | Same. |

---

This file lives in **commons** for reference when aligning APIs or behavior across Java, .NET, and TypeScript.
