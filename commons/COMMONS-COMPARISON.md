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

## 2. HTTP

### 2.1 HttpStatus

Java: Spring `HttpStatus`; .NET: static class with constants; TS: object with constants (e.g. OK, CREATED). Same conceptual usage.

### 2.2 JsonHttpClient

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **Constructor** | (HttpClient, baseUrl, errorType, ObjectMapper) or (baseUrl, errorType) | (baseUrl) | (baseUrl) |
| **Methods** | get(path, responseType), get(path), post(path, request, responseType), post(path, request), post(path, responseType), post(path), put(…), delete(…) | Get&lt;T&gt;(path), Get(path), Post&lt;T&gt;(path, request), Post(path, request), Post(path), Put&lt;T&gt;(path, request), Put(path, request), Delete&lt;T&gt;(path), Delete(path) | get&lt;T&gt;(path), getVoid(path), post&lt;T&gt;(path, request), postVoid(path, request?), put&lt;T&gt;(path, request), putVoid(path, request), delete&lt;T&gt;(path), deleteVoid(path) |

**Method content:**

- All: build request, send, map status to Result success/failure, deserialize body or error.
- Java: uses virtual thread executor for sync-over-async; .NET/TS async.
- TS: delegates to HttpGateway then HttpUtils.getOkResultOrFailure / getCreatedResultOrFailure / getNoContentResultOrFailure; Java/.NET do status checks inline. Same outcome.

**Naming:** Java/.NET overload get(path) vs get(path, type); TS uses get/getVoid, post/postVoid, etc. Same capabilities.

---

## 3. Playwright

### 3.1 PageClient

| Method (Java) | .NET | TypeScript | Content note |
|---------------|------|------------|---------------|
| fill(selector, value) | FillAsync(selector, text) | fill(selector, text) | Get locator, wait, fill. TS: null → ''. Same. |
| click(selector) | ClickAsync(selector) | click(selector) | Get locator, wait, click. Same. |
| readTextContent(selector) | ReadTextContentAsync(selector) | readTextContent(selector) | Wait, textContent. Same. |
| readAllTextContents(selector) | ReadAllTextContentsAsync(selector) | readAllTextContents(selector) | Locator, wait first element, allTextContents. Same. |
| isVisible(selector) | IsVisibleAsync(selector) | isVisible(selector), exists(selector) | TS exposes both; isVisible aligns with Java/.NET; exists delegates to isVisible. |
| isHidden(selector) | IsHiddenAsync(selector) | isHidden(selector) | count === 0. Same. |

**Constructor:** Java (Page, timeoutMs); .NET (IPage, baseUrl) with default timeout; TS (Page, baseUrl, timeoutMs). TS also has getBaseUrl(), getPage(); Java has private getLocator(selector, waitOptions).

**TS-only methods (no Java/.NET):** readInputValue, readInputIntegerValue, readInputCurrencyDecimalValue, readInputPercentageDecimalValue, waitForHidden, waitForVisible. Extra helpers; no conflict.

**Method content:** Wait-for-then-act pattern aligned; Java uses Locator.WaitForOptions with VISIBLE and timeout; TS uses locator.waitFor({ timeout }); .NET similar. Same semantics.

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
| parseInstant(text, nullValues…) | ParseDateTime(…, nullValues) | parseInstant(…, nullValues) | Null/blank/nullValues → null; try ISO then locale formats. Same. |

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
| JsonHttpClient | get(path, type), get(path) | Get&lt;T&gt;, Get | get, getVoid, post, postVoid, … | Same capabilities. |
| JsonWireMockClient | stubGet(path, code, body), stubGet(path, code) | StubGetAsync&lt;T&gt;, StubGetAsync | stubGet, stubGetNoBody | Same. |

---

This file lives in **commons** for reference when aligning APIs or behavior across Java, .NET, and TypeScript.
