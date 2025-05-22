---
sidebar_position: 4
id: security
sidebar_label: Security
---

# Security

:::warning

Don't expose this app to the internet unless you absolutely know what youre doing and implement your own safety features.

:::

Health data is highly sensible data. Self hosting the data is a huge step in the right direction, but even in your own network your data might not be safe.

:::warning[Disclaimer]

I am not a security expert. All security features are implemented to the best of my knowledge and belief. Also this page might not be complete.

:::

## Authentication

Auth is implemented using Microsoft Identity and JWT. Also there is a difference between Admin and User accounts. Every time the user logs on, the api will return a short lived access token and a refresh token. The access token is actually used when authenticating to the API and the refresh token is used to generate a new access token once it expires. Access tokens expire after 5 minutes and are stored in memory. A simple refresh of the page will delete the token. This mitigates the risks when a token is actually stolen. An access token cannot be revoked so if an attacker steals a token then the token can be used until it expires. Refresh tokens are saved in local storage which makes them possibly vurnerable to XSS. They expire after 30 days. If you suspect that your refresh token might have been stolen, log out to invalidate the refresh token. Also keep in mind that normally all traffic goes through http, meaning an attacker can steal information with a man-in-the-middle attack.

## Personal Access Tokens

If you want to use the API in isolation (without the frontend) you need to use Personal Access Tokens. You can create them in your user page. You need to be extra careful when using these. They never expire but can be revoked at any time through the web interface. The Personal Access Tokens will have the same rights as the user creating them, so if you are an admin user and create a Personal Access Token, this token will also have admin rights for the API.

## Forgetting Passwords

Sending of emails is not implemented and therefore it is not possible to securely reset your password if you forgot it. Admin users can reset the passwords for all users. If you lost access to all admin accounts, you might need to edit the users table in the database directly.

Changing passwords when you have access to your account is always possible through your user page.
