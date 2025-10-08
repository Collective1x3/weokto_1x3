PCI Vault Guides – Getting Started and Related Guides
Getting Started

PCI Vault is a zero-knowledge PCI DSS Level 1 compliant environment by SnapBill, Inc. This means PCI Vault can take care of your in‑scope PCI compliance burden without ever knowing what you store in the vault. This guide introduces the PCI Vault tokenization process. It is slightly technical, but non‑technical users should still be able to follow along. The simplest way to get started with PCI Vault is to use the API documentation. If you don’t have API credentials yet, register and get API access.

Before You Start: Verify Your Login Details (Optional)

Use the “Get User and Version Information” section in the API documentation and click on “Try Me!”. Enter the username and password you provided during registration. In the “Responses” section you should see a response similar to:

{
  "user": "your_username",
  "api_version": "1.3.7",
  "backwards_compatibility": "v1",
  "environment": "production"
}


Confirm that the user field matches your username. If it does, your login details are correct. Most browsers will store your username and password, so you won’t need to provide them on every request. If you access the API programmatically, provide the username and password with every request using Basic Auth.

Step 1: Add Your Own Key

A key is the private key part of a public‑key cryptography key pair. PCI Vault stores the private key in its trust store; you have access only to the passphrase needed to unlock the private key. Both parts are required to access the data. You only need one key to encrypt all your data, but PCI Vault recommends using a new key every few hundred data items for easier administration.

To generate a key, provide a user identifier and a passphrase. PCI Vault does not store the passphrase. If you lose it, the key becomes unusable and any data locked with it will be inaccessible. Use the “Create a Key” endpoint to create a key. Specify the user and passphrase fields in the request body and click “Try Me!”. The vault will respond like:

{
  "passphrase": "ALongAndVerySecretPassphraseThatIsSuperSecure",
  "user": "test-user"
}


The key is active immediately. Store the passphrase securely.

Step 2: Store Some Data in the Vault

Use the “Encrypt and Tokenize Data” endpoint to store data in the vault. Provide the user and passphrase so that PCI Vault can unlock the key. Use a meaningful reference to assist with lookups. The actual data must be provided as a valid JSON object. For example:

{
  "card_expiry": "06-2025",
  "card_holder": "J DOE",
  "card_number": "4111 1111 1111 1111"
}


PCI Vault encrypts your data, stores it and responds with a token similar to:

{
  "token": "753981707e3b4bf81a6d495f063461ce7b70fdb4c12f0dd760e1d31ebbc7c8cf",
  "user": "test-user",
  "reference": "SomethingMeaningfulToYou"
}


Store the token, user and reference along with the passphrase. You will need them to retrieve the data.

Step 3: Retrieve Data from the Vault

To retrieve data, use the “Decrypt or List Tokenized Data” endpoint. Provide:

The token generated previously,

The reference under which the data was stored,

The key and passphrase used to encrypt the data.

If you provide the correct information, the vault will decrypt the data and return it:

{
  "card_expiry": "06-2025",
  "card_holder": "J DOE",
  "card_number": "4111 1111 1111 1111"
}

Step 4: Start Developing!

You have successfully stored and retrieved data from PCI Vault. This guide introduced the key concepts needed to manually store and retrieve cards. To leverage PCI Vault fully, write software to interface with the API. The next step is to capture card data without your servers ever touching sensitive information.

Proxy Capture Data

This guide explains how to capture payment card data from a third party or web frontend without the data touching your own servers. By using uniquely generated capture endpoints you can ingest sensitive data without compromising your key or authorization details. Capturing data in this way is the most PCI‑compliant method of ingesting payment card data.

Overview

Creating and using a unique capture endpoint is a five‑step process (the last two steps are optional but recommended):

Create a unique endpoint by sending your key and passphrase to the vault.

Send the URL and secret to the third party.

The third party sends the data to the vault and receives a token and reference.

The third party sends the token and reference to your server.

Delete the endpoint so that it cannot be abused.

The interaction can be visualized as follows:

┌───────────┐       ┌─────────┐        ┌───────────┐
│Your Server│       │PCI Vault│        │Third Party│
└─────┬─────┘       └────┬────┘        └─────┬─────┘
      │                  │                   │      
      │1) Key, Passphrase│                   │      
      │───────────────>│                   │      
      │                  │                   │      
      │  1) URL, Secret  │                   │      
      │<───────────────│                   │      
      │                  │                   │      
      │            2) URL, Secret            │      
      │───────────────────────────────────>│      
      │                  │                   │      
      │                  │      3) Data      │      
      │                  │<─────────────────│      
      │                  │                   │      
      │                  │3) Token, Reference│      
      │                  │─────────────────>│      
      │                  │                   │      
      │         4) Token, Reference          │      
      │<───────────────────────────────────│      
      │                  │                   │
      │5) Delete Endpoint│                   │
      │─────────────────>│                   │
┌─────┴─────┐       ┌────┴────┐        ┌─────┴─────┐
│Your Server│       │PCI Vault│        │Third Party│
└───────────┘       └─────────┘        └───────────┘

Step 1: Create a Unique Endpoint

Create a capturing endpoint using the “Create a Capturing Endpoint” API. Each endpoint is backed by an existing secret key. Provide the user and passphrase in the query‑string parameters. The vault will encrypt and store the key information as if it were a card, and return a unique url and secret capable of encrypting data that can later be decrypted by the original key.

Optionally provide your own unique id if you don’t want the vault to generate a random URL. Each endpoint has a default time‑to‑live (TTL) of 24 hours; control the TTL via the query string. To make the endpoint permanent, specify a TTL of 0 seconds.

Example (Python):

import requests
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth('user', 'password')

url = "https://api.pcivault.io/v1/capture"
user = "test-user"
passphrase = "ALongAndVerySecretPassphraseThatIsSuperSecure"

res = requests.post(f"{url}?user={user}&passphrase={passphrase}&ttl=45m", auth=auth)

print(res)
print(res.text)


The response will look like:

{
  "url": "/v1/capture/NjUDoEi3z8zFB33WEwSRg",
  "secret": "S2TRYkjufkfwf8oItW2G_j1HcZ1ftMvURZwZJlbzb2BylPEPo8536sqdkO6J9i3x",
  "expires_at": "2022-07-25T15:42:59Z"
}

Step 2: Send URL & Secret to the Third Party

Share the URL and secret with the third party. Typically, you send these details in response to an HTTPS request from the third party.

Do:

Generate a new URL and secret for every data item—the capturing endpoints are meant to be short‑lived.

Be careful whom you share the URL and secret with. Anyone with the URL and secret can POST data until the endpoint is deleted or expires (each POST is charged as a normal API request).

Don’t:

Make it hard for the third party to access the URL and secret. If you’re replying to an HTTPS request, that’s sufficient encryption.

Share your basic‑auth details with the third party.

Share your key or passphrase with the third party.

If the third party is a web frontend, the user will have access to the data you send. To reduce risk, don’t disable expiry and delete the endpoint after it’s used.

Step 3: Third Party Stores the Data in the Vault

Using the URL and secret, the third party can send data to the vault for tokenization. The secret must be sent in the X-PCIVault-Capture-Secret HTTP header. Otherwise the request works exactly like posting data to the vault from your own server; however, the basic auth details, key and passphrase are replaced by the URL and secret.

Example using JavaScript’s fetch API:

const requestInfo = {
  method: 'POST',
  headers: {
    'X-PCIVault-Capture-Secret':
      'S2TRYkjufkfwf8oItW2G_j1HcZ1ftMvURZwZJlbzb2BylPEPo8536sqdkO6J9i3x',
  },
  body: JSON.stringify({
    "card_expiry": "06-2025",
    "card_holder": "J DOE",
    "card_number": "4111 1111 1111 1111"
  }),
};

fetch("https://api.pcivault.io/v1/capture/NjUDoEi3z8zFB33WEwSRg", requestInfo)
  .then((response) => response.json())
  .then((response) => {
    console.debug(response);
    // process the response
  });


The vault replies with a token and reference:

{
  "token": "96bee2420273079c0d552193b9222ae642481dac326dee08c60a95c824352359",
  "user": "test-user",
  "reference": "NjUDoEi3z8zFB33WEwSRg"
}


The default reference is the unique ID of the endpoint. The third party can override this by specifying a reference in the query string.

Step 4: Third Party Sends Token and Reference to Your Server

To store the token and reference, the third party forwards them to your server. If the third party fails to send them, you can search for them in the vault. Invoke GET /vault without supplying a token or reference to list all stored tokens and references.

Step 5: Delete the URL & Secret

Delete the endpoint after use to prevent abuse. Deletion makes the unique ID available for reuse. If an endpoint isn’t deleted, the vault cleans it after it expires; however, the unique ID remains reserved until the endpoint is deleted or cleaned.

Use DELETE /capture/{unique_id} to remove the endpoint.

Proxy Send Data

This guide explains how to send data to a third party without the sensitive data ever touching your servers. PCI Vault will send the data to the third party with exponential back‑off and return the third party’s response via webhook if the request is asynchronous (default), or directly in the response if synchronous.

Overview

Sending data from PCI Vault is a five‑step process:

Create a webhook endpoint on your server that is accessible via HTTPS.

Send a request to PCI Vault to send your card data to a third party, using a mustache template.

PCI Vault sends the request to the third party, automatically retrying on failure.

Receive the third party’s response on your webhook endpoint.

Reply to PCI Vault once you receive the webhook.

A typical flow looks like:

┌───────────┐             ┌─────────┐        ┌───────────┐
│Your Server│             │PCI Vault│        │Third Party│
└─────┬─────┘             └────┬────┘        └─────┬─────┘
      │                        │                   │      
      │1) Create Webhook       │                   │      
      │                        │                   │      
      │2) Proxy Request        │                   │      
      │───────────────────────>│                   │      
      │                        │                   │      
      │                        │3) Send & Receive  │      
      │                        │<─────────────────>│      
      │                        │                   │      
      │4) Third Party Response │                   │
      │<───────────────────────│                   │      
      │                        │                   │
      │5) Webhook Response     │                   │
      │───────────────────────>│                   │
┌─────┴─────┐             ┌────┴────┐        ┌─────┴─────┐
│Your Server│             │PCI Vault│        │Third Party│
└───────────┘             └─────────┘        └───────────┘

Step 1: Create a Webhook Endpoint

Create a webhook endpoint on your server. It must be accessible from the web and must use HTTPS. To protect the endpoint, provide a secret via an HTTP header. You will supply this secret to PCI Vault in step 2. You may choose to:

Create a new endpoint and secret for every proxy request (recommended),

Use one endpoint with a new secret for every proxy request,

Use a single endpoint and secret for all proxy requests (discouraged).

Step 2: Request Your Data to be Sent to a Third Party

Make a POST request to /proxy/post. The request body must contain a request template in JSON. For example:

{
  "request": {
    "method": "POST",
    "url": "https://example-psp.com/process",
    "headers": [
      {"Content-Type": "application/json"},
      {"Authorization": "Basic ZXhhbXBsZTpwYXNzd29yZA=="}
    ],
    "body": "{\"mustache_template\": \"{{number}}\"}"
  },
  "webhook": {
    "url": "https://reply-to.me",
    "secret": "rIx9tXqTH10_ShEThqQZ2yRI0e9_aPP9"
  }
}


PCI Vault will compile the mustache template with the data associated with the provided token. For example, if the template is:

{
  "number": "{{number}}",
  "cvv": {{cvv}},
  "expiry": "06/25"
}


And the stored data has fields number, cvv and expiry, the resulting request body might be:

{
  "number": "4111 1111 1111 1111",
  "cvv": 234,
  "expiry": "06/25"
}


PCI Vault validates:

The request URL must use HTTPS.

The request method must be a valid HTTP method if present.

If the webhook is present, its URL must be HTTPS and the secret must be present.

If PCI Vault responds with 200 OK, the request will be sent. Any other response means something went wrong and the request will not be sent.

Apply a Transformation Rule (Optional)

When sending data to a third party, you might need to transform it into a different format. Create a custom rule and instruct PCI Vault to apply it before substituting values in the mustache template. Rules are created and managed using the Rules API. For a list of available operations, see the Rule Engine guide.

Example: To convert numeric strings to integers and generate hashes, you can specify rules in the query string: ?rules=convert-ints,generate-hash. Multiple rules are applied in the order specified.

Fields produced by the rule can be used in header values, URL parameters and the request body. For example:

{
  "request": {
    "method": "POST",
    "url": "https://example-psp.com/process?signature={{body_hash}}",
    "headers": [
      {"Content-Type": "application/json"},
      {"X-Custom-Header": "{{operation_output}}"}
    ],
    "body": "{\"mustache_template\": \"{{number}}\", \"amount\": \"{{amount}}\"}",
    "extra_data": {
      "amount": 4450
    }
    ...
  }
}


Include the rule IDs in the query: ?rules=convert-ints,generate-hash.

Step 3: PCI Vault Handles the Request

PCI Vault sends the request to the third party on your behalf. If the third party responds with a 429 or 5xx error, PCI Vault retries the request with exponential back‑off until it succeeds or fails after multiple attempts. Any response outside the 5xx range is forwarded to your webhook.

Step 4: Handle Webhook Requests

PCI Vault will POST to your webhook endpoint and include your secret in the X-PCIVault-Webhook-Secret header. Ensure that the secret matches the one you provided. The POST body looks like:

{
  "headers": [
    {"Content-Type": "application/json"},
    {"Content-Length": "24"},
    {"X-Custom-Header": "custom-data"}
  ],
  "body": "{\"status\": \"processed\"}",
  "status": "200"
}


All headers from the third party’s response are included. The response body is copied verbatim and JSON‑escaped.

Step 5: Respond to the Webhook Request

Reply to PCI Vault with an HTTP status code in the 2xx range when you successfully process the request. Any other status causes PCI Vault to retry the webhook with exponential back‑off. Each attempt to POST to the webhook is charged as a normal API operation.

Handle these cases:

If no secret is present, respond with 404 Not Found or 401 Unauthorized.

If the secret is incorrect, respond with 403 Forbidden. PCI Vault staff will contact you to resolve the issue.

If the request is not a POST, respond with 405 Method Not Allowed.

Proxy Receive Data

This guide shows how to receive data from a third party without the data touching your own servers. PCI Vault requests the data from the third party with built‑in exponential back‑off and returns the resulting token to you via webhook if asynchronous (default) or in the response if synchronous.

Overview

Receiving data via PCI Vault is a five‑step process:

Create a webhook endpoint on your server (HTTPS).

Send a request to PCI Vault to retrieve data from a third party.

PCI Vault sends a request to the third party, automatically retrying on failure, and securely stores the data.

Receive the resulting PCI Vault token on your webhook.

Reply to PCI Vault once you receive the webhook.

Step 1: Create a Webhook Endpoint

As in the Proxy Send guide, create a webhook endpoint accessible via HTTPS. Secure it with a secret passed in an HTTP header, and choose whether to use new endpoints and secrets for each request or reuse them.

Step 2: Request Your Data to be Sent to a Third Party

Make a POST request to /proxy/get. The request body must contain a request template:

{
  "request": {
    "method": "POST",
    "url": "https://example-issuer.com/new-card",
    "headers": [
      {"Content-Type": "application/json"},
      {"Authorization": "Basic ZXhhbXBsZTpwYXNzd29yZA=="}
    ],
    "body": "This can be literally anything, it will be forwarded to the third party."
  },
  "webhook": {
    "url": "https://reply-to.me",
    "secret": "rIx9tXqTH10_ShEThqQZ2yRI0e9_aPP9"
  }
}


This will POST the specified body to https://example-issuer.com/new-card with the given headers. PCI Vault will validate the request (HTTPS, valid method, webhook URL and secret present). A 200 OK response means the request will be sent; otherwise nothing is sent.

Step 3: PCI Vault Handles the Request and Response

PCI Vault sends the request to the third party on your behalf. If the third party responds with a 429 or 5xx error, PCI Vault retries with exponential back‑off. If the response succeeds, PCI Vault stores the data. Optionally set the smart_parse flag to true for automatic parsing and censorship.

Step 4: Handle Webhook Requests

PCI Vault will POST to your webhook endpoint with your secret in the X-PCIVault-Webhook-Secret header. The body of the POST looks like:

{
  "headers": [
    { "Content-Type": "application/json" },
    { "Content-Length": "24" },
    { "X-Custom-Header": "custom-data" }
  ],
  "status": "200",
  "token_info": {
    "token": "31fd87cdc5bf9bf13c28684917f9888bf775b07e2f4d8a6ff583ef7c743d2433",
    "user": "test3",
    "stored_at": "2023-09-06T13:34:06.467787655Z"
  }
}


All headers from the third party’s response are included. If smart_parse is active, a censored version of the original response (formatted as a mustache template) is included.

Step 5: Respond to the Webhook Request

Respond with a 2xx status code if you processed the request successfully. Any other status causes PCI Vault to retry the webhook with exponential back‑off.

If no secret is present, return 404 Not Found or 401 Unauthorized.

If the secret is incorrect, return 403 Forbidden.

If the request method is not POST, return 405 Method Not Allowed.

Stripe Example

This guide shows how to send PCI Vault tokens to Stripe. Code examples for this guide are available at https://github.com/pci-vault/golang-vue-example
.

Overview

We will:

Capture payment card data.

Send the captured data to Stripe.

Step 1: Capturing Card Data

Create a capturing endpoint using the POST /capture endpoint. For a Golang example, see the linked code. Once you have a capturing endpoint, use it to capture card data with a PCD Form. The form submits user‑entered data directly to PCI Vault and prepares it for Stripe without transformation.

The data stored in the vault will look like:

{
  "card_number": "2343 2534 5456 4557",
  "card_holder": "Test Person",
  "cvv": "123",
  "expiry": "02/27",
  "expiry_year": "2027",
  "expiry_month": "02"
}


Store the token and reference for the card; you will need them in the next step.

Step 2: Sending the Captured Data to Stripe

Use the POST /proxy/post endpoint to send data to Stripe. For Golang examples, refer to the linked code. Provide the token and reference from Step 1 and specify the HTTP request to send to Stripe in JSON:

{
  "request": {
    "body": "type=card&card[number]={{card_number}}&card[exp_month]={{expiry_month}}&card[exp_year]={{expiry_year}}",
    "headers": [
      { "Content-Type": "application/x-www-form-urlencoded" },
      { "Authorization": "Bearer sk_test_*" }
    ],
    "method": "POST",
    "url": "https://api.stripe.com/v1/sources"
  },
  "webhook": {
    "url": "https://reply-to.me/example"
  }
}


This example creates a Source at Stripe that can be charged later. You can change the URL to create a PaymentMethod or perform other actions. For example:

{
  "request": {
    "body": "type=card&card[number]={{card_number}}&card[exp_month]={{expiry_month}}&card[exp_year]={{expiry_year}}&card[cvc]={{cvv}}&metadata[pmCustomer]=cus_NryKXV0Ppmnwt1&metadata[pmId]=B0F84856-CCF5-4C9A-A970-313F5302A5A2&metadata[esiId]=876866C2-24E0-4071-9549-0BC531559EA3",
    "headers": [
      { "Content-Type": "application/x-www-form-urlencoded" },
      { "Authorization": "Bearer sk_test_*" }
    ],
    "method": "POST",
    "url": "https://api.stripe.com/v1/payment_methods"
  },
  "webhook": {
    "url": "https://reply-to.me/example"
  }
}


In this example, the body string is a mustache template that resolves to URL‑encoded parameters. For instance:

type=card&card[number]={{card_number}}&card[exp_month]={{expiry_month}}&card[exp_year]={{expiry_year}}


If the stored data is:

{
  "card_number": "2343 2534 5456 4557",
  "expiry_month": "02",
  "expiry_year": "2027"
}


The resolved body will be:

type=card&card%5Bnumber%5D=2343 2534 5456 4557&card%5Bexp_month%5D=02&card%5Bexp_year%5D=2027


It is recommended to add webhook details; Stripe’s response will be forwarded to the webhook. A successful call to Stripe generates a webhook body similar to:

{
  "headers": [
    {
      "Access-Control-Expose-Headers": "Request-Id, Stripe-Manage-Version, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required"
    },
    {
      "Idempotency-Key": "55feb4ff-0b91-4894-96e0-ae938b3dc28e"
    },
    {
      "Request-Id": "req_tlJ0eneDD5auHu"
    },
    {
      "Stripe-Should-Retry": "false"
    },
    {
      "Content-Type": "application/json"
    },
    {
      "Cache-Control": "no-cache, no-store"
    },
    {
      "Original-Request": "req_tlJ0eneDD5auHu"
    },
    {
      "Content-Length": "946"
    },
    {
      "Access-Control-Allow-Credentials": "true"
    },
    {
      "Access-Control-Max-Age": "300"
    },
    {
      "Stripe-Version": "2019-03-14"
    },
    {
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
    },
    {
      "Date": "Thu, 26 Jan 2024 09:31:18 GMT"
    },
    {
      "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS, DELETE"
    },
    {
      "Access-Control-Allow-Origin": "*"
    },
    {
      "Server": "nginx"
    }
  ],
  "body": "{\n  \"id\": \"src_1MURndBXqPmQKuMXJ6YLEgxx\",\n  \"object\": \"source\",\n  \"amount\": null,\n  \"card\": {\n    \"address_line1_check\": null,\n    \"address_zip_check\": null,\n    \"brand\": \"MasterCard\",\n    \"country\": null,\n    \"cvc_check\": null,\n    \"dynamic_last4\": null,\n    \"exp_month\": 2,\n    \"exp_year\": 2027,\n    \"fingerprint\": \"5SYfsE30rhbPsvSF\",\n    \"funding\": \"unknown\",\n    \"last4\": \"4557\",\n    \"name\": null,\n    \"three_d_secure\": \"optional\",\n    \"tokenization_method\": null\n  },\n  \"client_secret\": \"src_client_secret_7ePbhdmIcfV1aiLZSw9QUMAZ\",\n  \"created\": 1674725477,\n  \"currency\": null,\n  \"flow\": \"none\",\n  \"livemode\": false,\n  \"metadata\": {},\n  \"owner\": {\n    \"address\": null,\n    \"email\": null,\n    \"name\": null,\n    \"phone\": null,\n    \"verified_address\": null,\n    \"verified_email\": null,\n    \"verified_name\": null,\n    \"verified_phone\": null\n  },\n  \"statement_descriptor\": null,\n  \"status\": \"chargeable\",\n  \"type\": \"card\",\n  \"usage\": \"reusable\"\n}",
  "status_code": 200
}


The body contains the JSON returned by Stripe, including fields such as id, object, amount, card, client_secret, created, currency, flow, livemode, metadata, owner, status, type and usage.

Stripe Forwarding Example

This guide helps you set up a capturing endpoint to accept card data forwarded by Stripe using their forwarding request API.

Overview

We will:

Create a rule to transform the data sent by Stripe.

Create a capture endpoint.

Request access to Stripe’s Forwarding API.

Initiate a forwarding request.

Step 1: Create a Rule to Transform the Data Sent by Stripe

Stripe forwards card data in a nested format:

{
  "card": {
    "number": "4242424242424242",
    "exp_month": "12",
    "exp_year": "2023",
    "name": "John Doe",
    "cvc": "123"
  },
  "metadata": {
    "custom": "custom_value"
  }
}


PCI Vault’s hosted forms capture card data in a flatter structure. To keep the data consistent, create a rule using the Add Rule API. Give the rule a meaningful name in the id query parameter (e.g. stripe-forwarding-transform). In the request body, define the list of operations:

{
  "operations": [
    {
      "name": "template",
      "input_field": "*",
      "output_field": "*",
      "order_position": 1,
      "arguments": {
        "template": "{\"card_number\": \"{{card.number}}\", \"expiry_month\": \"{{card.exp_month}}\", \"expiry_year\": \"{{card.exp_year}}\", \"card_holder\": \"{{card.name}}\", \"cvv\": \"{{card.cvc}}\", \"custom\": \"{{metadata.custom}}\"}"
      }
    },
    {
      "name": "substr",
      "input_field": "expiry_year",
      "output_field": "expiry_year_short",
      "order_position": 2,
      "arguments": {
        "start": -2,
        "end": 0
      }
    },
    {
      "name": "format",
      "input_field": "expiry_year",
      "output_field": "expiry",
      "order_position": 3,
      "arguments": {
        "format_string": "%v/%v",
        "keys": ["expiry_month", "expiry_year_short"]
      }
    }
  ]
}


Explanation:

template: Flattens and renames fields. Using output_field: "*", the output replaces the entire object.

substr: Extracts the last two characters of expiry_year and stores them in expiry_year_short (e.g. "2025" → "25").

format: Formats a string using values from expiry_month and expiry_year_short to produce expiry (e.g. "02/25").

Submit the request to create the rule. You will use it in the next step.

Step 2: Create a Capture Endpoint

Create a capture endpoint using POST /capture. For more details, see the Proxy Capture Data guide. Use your key and passphrase as usual. Specify a ttl value of 0 (or P0T0) to create an endpoint that never expires. For the rules query parameter, enter the ID of the rule created in the previous step (stripe-forwarding-transform). Store the returned endpoint unique_id and secret.

Step 3: Request Access to Stripe Forwarding API

Stripe’s Forwarding API is not enabled by default. You must request access. When submitting a support ticket to Stripe, include your newly created endpoint URL (e.g. https://api.pcivault.io/v1/capture/<endpoint_id>) and attach PCI Vault’s Attestation of Compliance document, obtained via the GET /certificate request.

Step 4: Initiate a Forwarding Request

Once Stripe enables the Forwarding API, enable forwarding of the X-PCIVault-Capture-Secret header. Initiate a forwarding request using curl:

curl --location 'https://api.stripe.com/v1/forwarding/requests' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Authorization: Bearer <STRIPE_API_KEY>' \
  --data-urlencode 'payment_method=<STRIPE_PAYMENT_METHOD_ID>' \
  --data-urlencode 'url=https://api.pcivault.io/v1/capture/<CAPTURE_ENDPOINT_ID>?reference=<REFERENCE>' \
  --data-urlencode 'request[headers][0][name]=X-PCIVault-Capture-Secret' \
  --data-urlencode 'request[headers][0][value]=<CAPTURE_ENDPOINT_SECRET>' \
  --data-urlencode 'request[body]={'"'"card"'"': {"'"number"'"': "", "'"exp_month"'"': "", "'"exp_year"'"': "", "'"cvc"'"': "", "'"name"'"': ""}, "'"metadata"'"': {"'"custom"'"': "custom_value"}}' \
  --data-urlencode 'replacements[0]=card_number' \
  --data-urlencode 'replacements[1]=card_expiry' \
  --data-urlencode 'replacements[2]=card_cvc' \
  --data-urlencode 'replacements[3]=cardholder_name'


This request tells Stripe to forward the specified payment method to your PCI Vault URL. Stripe will forward the data from their vault to your capture endpoint and return the response synchronously. Typically you would set up Stripe webhooks for payment_method.updated and payment_method.automatically_updated events. When one of these events occurs, initiate a forwarding request to update the card in your vault and keep the data in sync.

Hosted PCD Forms

Using hosted forms is the most PCI‑compliant way to capture or retrieve payment card data. The forms are hosted by PCI Vault (a PCI DSS Level 1 compliant vendor). You can embed the forms in your system or website using an <iframe> or by opening them in a separate window or tab.

These forms leverage PCI Vault’s capture and retrieval endpoint technology. If you want to receive the tokenization result via webhook when capturing data, specify a webhook URL on the capture endpoint.

PCI Vault offers standard hosted forms as well as configurable and custom forms.

Standard Hosted Form – Capture

Generate a capture endpoint, keeping the unique_id and secret.

Load the standard form by constructing a URL containing the unique_id and secret. For payment card data use:

https://api.pcivault.io/v1/capture/iframe/pcd?unique_id=your_unique_id_here&secret=your_secret_here


For bank accounts use:

https://api.pcivault.io/v1/capture/iframe/ach?unique_id=your_unique_id_here&secret=your_secret_here


Use the URL in an iframe src attribute or open it in a new tab. It works out of the box if the unique ID and secret are valid.

Standard Hosted Form – Retrieve

Generate a retrieval endpoint, keeping the unique_id and secret.

Load the form using the unique_id, secret, and the token–reference pair of the stored card data. For payment card data:

https://api.pcivault.io/v1/retrieve/iframe/pcd?unique_id=your_unique_id_here&secret=your_secret_here&token=card_token_here&reference=card_reference_here


Use this URL in an iframe or open it in a new tab. It works as long as the parameters are valid.

For retrieval, PCI Vault currently has a standard form only for payment card data.

Configured Hosted Form

PCI Vault offers highly customizable forms. You can include your own JavaScript and CSS to change branding and behavior. When generating a configured form you can specify:

form_type: pcd for payment card data, ach for bank account details or custom.

form_id: Unique identifier for the form (if omitted, PCI Vault generates one).

css_links: External CSS to modify appearance.

js_links: External JavaScript to modify appearance and behavior.

embedded_css: Base64‑encoded CSS to embed in the form.

embedded_js: Base64‑encoded JavaScript to embed in the form.

force_keypad: Force a keypad with randomized buttons (default false).

hide_card: Toggle the rendered credit‑card animation on the PCD form (default false).

disable_luhn: Disable Luhn validation (PCD form only; default false).

strip_spaces: Remove spaces from the credit‑card number (PCD form only; default false).

field_options: Hide fields or disable validation on them (object with validate and visible keys).

success_callback: Base64‑encoded JavaScript function to call if the form submits successfully.

error_callback: Base64‑encoded JavaScript function to call if an error occurs on submission.

To create and use a configured form:

Generate a capture endpoint and note the unique_id and secret.

Create your customized hosted form and note the returned id.

Load the configured form using:

https://api.pcivault.io/v1/capture/iframe/form_id_here?unique_id=your_unique_id_here&secret=your_secret_here


When loading the form, you can specify additional query parameters:

testing=true causes the form to submit to api-stage.pcivault.io.

title sets the page title.

reference pre‑populates the reference field (invisible to the user).

Any other query parameter is added to an extra_data object and submitted along with the form data.

Custom Hosted Form

PCI Vault can host a fully custom form. Use form_type=custom when creating the form. Provide your JavaScript in embedded_js or host it externally and link it via js_links. Your script must define a function custom_form on the window object. This function receives:

A DOM element on which to mount the form,

An options object with fields such as:

submit_secret: The secret specified in the query string,

submit_url: Always /v1/capture/{unique_id}—prepend https://api.pcivault.io or https://api-stage.pcivault.io based on the testing flag,

force_keypad, hide_card, disable_luhn, strip_spaces, field_options,

reference, extra_data, testing (boolean).

Render your form by invoking:

window["custom_form"](document.getElementById("mount_form_element"), properties);


This approach requires development work but provides maximum flexibility. Examples (using React, Vite, React Bootstrap, Formik and Axios) are available in the PCI Vault documentation. The Footnotes in the guide explain that PCI Vault forms contain HTML IDs in most form elements and give styling advice. Field options are represented as objects where keys are field names and values specify validate and visible flags.

Token Algorithms

PCI Vault supports four tokenization algorithms. You can specify the algorithm when creating a capture endpoint or when sending a PAN to the vault directly. All algorithms derive the token from a number extracted from your data. The number is determined as follows:

The JSON object is checked for fields number, card_number, n or account_number in that order; if one exists, its value is used.

If none of these fields exist, the query parameters are checked for the same field names.

If none are found, the request fails with status 400.

Tokens are sensitive to spaces: a PAN with spaces generates a different token than one without spaces.

Full Tokenization (Default)

Full tokens use a proprietary cryptographically secure hashing algorithm. Tokens are 64 characters long and highly collision‑resistant. This is the recommended algorithm unless you have specific needs. Specify algorithm=full or omit the algorithm to use full tokenization.

Example:

Number	Token
4111111111111111	9bfe9241f7ad0d84230e9837aa99c64bf3c3936478317146d1f7c58a66f40af6
5425233430109903	bf2fa482286633fab50369c8ba855bf7bc5b1d29bb5ffc183b371e20b9d6253d
4263982640269299	744d174e68756188bb48dd69ff69d1a4f4ed3a2ca1d3d0747b3b8d768f010e0b
374245455400126	a8366e50f6aafd1cc71360f43060808f2ef9f6f8a850319aff629a0b80ddd7de
Partial Tokenization

Partial tokenization restricts the token length to the same length as the input number. Collision resistance is reduced, so use a unique reference for each token to guarantee uniqueness. Partial tokens are created by generating a full token and trimming it; a specified portion of the original number is replaced with the generated token.

To use partial tokenization, specify algorithm=partial_n_pos where n is between 8 and 16 and pos is start or end. Example for partial_8_end:

Number	Token
4111111111111111	411111119bfe9241
5425233430109903	54252334bf2fa482
4263982640269299	42639826744d174e
374245455400126	3742454a8366e50
Partial Middle Tokenization

Partial middle tokenization works like partial tokenization but specifies which part of the original number to replace. Specify algorithm=partial_middle_s_e where s is the number of digits to keep at the start and e is the number of digits to keep at the end. Everything in between is replaced with the first portion of the generated token. If the portion to be replaced is less than five digits long, full tokenization is used to mitigate collisions. Example for partial_middle_6_4:

Number	Token
4111111111111111	411111ab4bfe1111
5425233430109903	542523c67a1a9903
4263982640269299	426398e0eae69299
374245455400126	374245eae6c0126
Luhn‑Compliant Tokenization

Luhn‑compliant tokens are 16‑digit credit‑card numbers that pass the Luhn algorithm. They are less collision‑resistant than full tokens but adequate for most applications. Limit the number of tokens per unique reference to a few thousand. Specify algorithm=luhn to use this algorithm. Example:

Number	Token
4111111111111111	5560386204722122
5425233430109903	3113674056387905
4263982640269299	3543337643660602
374245455400126	3935235944928114
Stored Credentials

The VISA Stored Credential Transaction framework defines best practices for storing payment card information for future transactions. Although the framework is a VISA requirement, it is good practice to comply with it for all payment cards. To comply, you must:

Disclose how the cardholder’s credentials will be used.

Obtain and store a mandate indicating the cardholder’s consent.

Notify the cardholder of any changes to the agreement.

Notify the cardholder that the credentials have been stored, by performing an initial payment or a zero/auth charge.

Submit extra details to your payment processor to indicate how the credentials are being used.

Proactively notify the cardholder of future transactions and their ability to cancel the agreement.

PCI Vault can help with storing the mandate and performing a charge (recurring, initial or zero/auth).

Storing a Mandate

If you will use stored credentials to initiate transactions, understand the transaction type:

Type	Description
Instalment	A series of payments at regular intervals for a single purchase.
Recurring	A series of payments at regular intervals for future goods and services.
Unscheduled	A payment at a future agreed‑upon date or event, which does not happen at a regular interval (e.g. account top‑up).

The cardholder consent mandate must include:

The last four digits of the card number.

How the cardholder will be notified of changes.

The agreement’s expiry date.

How the stored credentials will be used.

If you will use the stored credentials to initiate transactions, store:

The amount or how it will be calculated.

Any permitted extra charges.

The transaction frequency (for recurring transactions).

The total purchase amount (for instalment transactions).

The terms of future transactions (for instalment transactions).

The event that initiates the transaction (for unscheduled transactions).

You can store a mandate on PCI Vault. One option is to store the standard parts of the agreement on your servers and the non‑standard parts as a JSON object on PCI Vault. The two pieces can be merged to generate a mandate document for the cardholder.

Use the POST /vault/update endpoint to add mandate details to an existing token. For example, to mark a token as a stored credential for instalment transactions:

{
  "mandate": {
    "last_4": "4953",
    "expiry": "2031-12-01",
    "type": "instalment",
    "total_amount": 700000,
    "recurring_amount": 7000
  }
}


This request adds mandate as a first‑level key in the existing encrypted data without changing the token. Retrieve mandate information via GET /vault (use the mask_fields argument to avoid returning full PANs).

Initiating a Charge

When credentials are stored, you must initiate an initial charge or zero/auth verification. Subsequent charges also include extra information sent to the payment service provider (PSP). The required fields and formats vary by PSP. Check your PSP documentation for details. Store non‑sensitive extra data on your servers; sensitive data can be stored in PCI Vault. Submit charges via PCI Vault using the proxy endpoint. For more details, see the Proxying Payment Card Data guide. For a Stripe example, see the Stripe Example guide.

Rule Engine

PCI Vault’s rule engine can transform data on certain endpoints, which is useful for sanitizing input. Each rule consists of operations applied in the specified order. Each operation must have an input field, an output field and a name. Some operations have required or optional arguments. The output of one operation can be used as the input to another, allowing you to chain operations (e.g. use template to produce a JSON string and then compute its checksum with hash).

Supported Operations

noop – Copies a value from one field to another.

stringify – Converts data of any type to a string.

substr – Takes a substring from a string. Optional start and end indices (0‑indexed). Negative indices count from the end.

parse_float – Parses a float from a string; if parsing fails, copies the value.

parse_json – Parses a JSON object from a string; if parsing fails, copies the value.

convert_to_int – Converts input to an integer. Accepts strings (optional base), floats (fractional part discarded) and booleans (true → 1, false → 0). On failure, copies the value.

replace – Replaces all occurrences of substr with new_str in a string. Required fields: substr and new_str.

mask – Masks a substring specified by start and end. Optional char specifies the masking character; default is *.

format – Uses a format string (similar to Golang’s formatting library) to embed values from the JSON. Required: format_string and keys.

template – Generates a string by interpolating current values into a mustache template. Required: template. Quotes must be escaped. The operation uses the current state of values at its position in the rule.

hash – Computes a cryptographic hash. Required: algorithm. For HMAC algorithms, also specify key and optionally hex_key (set hex_key=true if the key is raw hexadecimal). Supported algorithms: md5, sha-1, sha-256, sha-384, sha-512, hmac-sha-1, hmac-sha-256, hmac-sha-384, hmac-sha-512.

encode – Encodes bytes to a string. Required: scheme (currently base64 or base32). Optional: hex_input (set to true if the input is a hexadecimal string).

Examples and Notes

For substr, if end is 0, it means the end of the input field. Negative indices count from the end. For example, given "012345", start=-2, end=0 yields "45".

For mask, if end is 0 it resolves to the length of the string. For example, masking "012345" with start=-2, end=0 and default char="*" yields "0123**".

For format, the %v directive inserts a value into the string. For example, format_string="%v/%v" and keys=["2024","12"] yields "2024/12".

For template, quotes in the template must be escaped. Example: a template of {\"name\": \"{{name}}\",\"value\": \"{{value}}\"} with values { "name": "John", "value": 38 } yields {\"name\": \"John\",\"value\": \"38\"}.

For hash, if the algorithm is HMAC‑based, provide a key (as UTF‑8) or set hex_key=true and provide a hexadecimal key. Example: input "some_value", algorithm "hmac-sha-256" and key "secret" computes "1f874077e0ffc9a1c63fd4ba52046f2a342a9327872c84572933307d3ea40c0c".

For encode, set hex_input to true when the input is a hexadecimal string; otherwise the input is treated as UTF‑8.