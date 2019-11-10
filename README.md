
[uri_license]: http://www.gnu.org/licenses/agpl.html
[uri_license_image]: https://img.shields.io/badge/License-AGPL%20v3-blue.svg

[![License: AGPL v3][uri_license_image]][uri_license]
[![Managed with Taiga.io](https://img.shields.io/badge/managed%20with-TAIGA.io-709f14.svg)](https://tree.taiga.io/project/monogrammbot-monogrammemail_signature_generator/ "Managed with Taiga.io")
[![Build Status](https://travis-ci.org/Monogramm/email_signature_generator.svg)](https://travis-ci.org/Monogramm/email_signature_generator)

# Email Signature Generator

> :alembic: **Experimental** Test project for generating email signature using templates.

The aim for this project is to provide a simple web application to generate an email signature based on a template.
The key features to develop are:
* automatically encode in base64 images uploaded (company logo or profile picture)
* allow an admin to setup default templates the users can choose from
* allow a connection to LDAP server(s):
    * to secure the app (only allow authenticated users to generate signature)
    * retrieve automatically the personal information from the LDAP (admin could define the fields mapping)
    * allow the user to save in their LDAP profile the personal information they entered in the form
* allow multiple file formats for input and output (text only, HTML, Markdown)
* add a Visit Card generator and PDF export


For reference, the concept is similar to the following websites though our aim is to provide a simple solution to host privately:
* https://webapp.wisestamp.com/
* https://mysignature.io/editor
* https://www.hubspot.fr/email-signature-generator

**:construction: This project is still in development!!**

## :rocket: Usage

Look at [README.jhipster.md](./README.jhipster.md) for usage details.

## :bust_in_silhouette: Author

**Monogramm**

* Website: https://www.monogramm.io
* Github: [@Monogramm](https://github.com/Monogramm)

**Dimanaux**

* Github: [@Dimanaux](https://github.com/Dimanaux)

## :handshake: Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Monogramm/email_signature_generator/issues).
[Check the contributing guide](./.github/CONTRIBUTING.md).<br />

## :thumbsup: Show your support

Give a :star: if this project helped you!

## :page_facing_up: License

Copyright © 2019 [Monogramm](https://github.com/Monogramm).<br />
This project is [AGPL v3](uri_license) licensed.

***
_This README was generated with :heart: by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
