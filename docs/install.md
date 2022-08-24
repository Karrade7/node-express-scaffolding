https://blog.gisspan.com/2016/04/making-sense-of-ssl-rsa-x509-and-csr.html]]]
https://www.digicert.com/kb/ssl-support/openssl-quick-reference-guide.htm

Copy files
Create new cert
npm run dev

Securing Web Communication

SSL: is the standard protocol to secure the communication between a web server and a browser, by creating an encrypted link between the two.
SSL has gone through multiple versions and after version 3 was called TLS.
TLS stands for “Transport Layer Security.”
TLS 1.2 is the most widely deployed protocol version.
All version before this (SSL 1.x, SSL 2.x, SSL 3.x, TLS 1.0, TLS 1.1) are considered vulnerablel.

Proof of attack:


Creating a TLS connectioon is based on the web server sendng and recieving encrypted data using asymetirc encryption (also known as public key encryption). Pyblic key encyption uses a pair of keys, one public and one private. Its slower than ymetric ket encrytion where their is a single key used. 
For speed an optomization, tlS first ecrypts using assymetric encryption but then generate and transmits a symetric key over the initial encryptied connection. 
Because the public key decryption is slow and expensive, so the web server and the browser will switch to symmetric encryption where only one key is required.
This symmetric key is then used for further communication until a certain timeout is reached when the symetric key is renegotiated

They negotiate between each other on what the best encryption algorithm they should use. The algorithm used would depend on the server and the browser.

To set this up:

1. The server generates a private key for itself
1a. This key itself can be encrypted with a phase phrase and a specific encryption algorithim
2. The server creates a public key from the private key
2. The key is then requested to be signed by a certificate authorty by creating a Certifacte Signing Request that includes the private key as well as additional identifying information
3. The CSR is signed by a certificate authority. If signed by a local authority, a CSR is not needed and proviate key and additional information can be provided interactively
4. One the certicate authoeity signs the request it creates a certficate which the web server can privude
5. The new certificate includes: and and has the certificate authority validation that this 


These are usually in PEM format (Privacy Enhanced Mail)
PEM is a text representation of the real binary key in DER format(X.509 ASN.1 key), it is base64 encoding of the DER binary format.

The industry decided to combine these two in one file, which is called : digital certificate, or SSL certificate.
 standard called X.509.
 Certificate format X.509 v3
Version Number 
Serial Number 
Signature Algorithm ID 
Issuer Name
Validity period
Not Before
Not After
Subject name
Subject Public Key Info
Public Key Algorithm
Subject Public Key
Issuer Unique Identifier (optional)
Subject Unique Identifier (optional)
Extensions (optional)
...
Certificate Signature Algorithm
Certificate Signature

A self-signed certificate is a certificate that's signed with its own private key. It can be used to encrypt data just as well as CA-signed certificates, but our users will be shown a warning that says the certificate isn't trusted.

-------------------

# Generate a private and public RSA key without encryption - comes as a single file in RSA format
openssl genrsa -out server.key 2048

# To create a key that is encryoted, add the encryption algorithm and you will be promoted for a passphrase to encrypt it with
# -aes128, -aes192, -aes256, -aria128, -aria192, -aria256, -camellia128, -camellia192, -camellia256, -des, -des3, -idea
openssl genrsa -aes256 -out domain.key 2048

# Extracting the public key from private key file
openssl rsa -pubout -in server.key -out server.pub

# Create certificate signing request from private key, unecnrypted with subject specififed
openssl req -new -key "server.key" -out "server.csr" -nodes -subj -sha256 "/C=US/O=Your Company, Inc./OU=IT/CN=localhost"

# The CA will sign the request like this if using open ssl
openssl ca -in "server.csr" -out "server.crt"

# To self sign use the x509 cmmand 
openssl req -new -x509 -key "server.key" -out "server.crt" 

-addext "subjectAltName = DNS:foo.co.uk"

# Doing all of this in one commmand
openssl req -new -newkey rsa:2048 -x509 -nodes -days 390 -sha256 -keyout "server.key" -out "server.crt" -subj "/C=us/CN=localhost.local" -addext "subjectAltName = DNS:localhost"


# Request a certficate signing request or even to have a key signed
openssl req
-new : option indicates that a CSR is being generated. This option generates a new certificate request. It will prompt the user for the relevant field values. The actual fields prompted for and their maximum and minimum sizes are specified in the configuration file and any requested extensions.
-key filename This specifies the file to read the private key from. 
-digest 
-out filename This specifies the output filename to write to or standard output by default.
-nodes If this option is specified then if a private key is created it will not be encrypted.
-subj arg Provide all the info from command line -subj "/C=US/ST=Utah/L=Lehi/O=Your Company, Inc./OU=IT/CN=yourdomain.com"
-days n
-newkey arg - This option creates a new certificate request and a new private key. 
rsa:nbits
param:file
ec:filename 
-pubkey : Outputs the public key.
-in filename This specifies the input filename to read a request from or standard input if this option is not specified. A request is only read if the creation options (-new and -newkey) are not specified.
-keyout filename This gives the filename to write the newly created private key to. If this option is not specified then the filename present in the configuration file is used.
-x509 This option outputs a self signed certificate instead of a certificate request.  This is typically used to generate a test certificate or a self signed root CA.
-addext ext Add a specific extension to the certificate (if the -x509 option is present) or certificate request. 



req -new -newkey rsa:2048 -x509 -nodes -days 390 -keyout "RootCA.key" -out "RootCA.pem" -subj "/C=us/CN=localhost.local"

# Create self signed root cert:
openssl req -new -newkey rsa:2048 -x509 -nodes -days 390 -keyout "RootCA.key" -out "RootCA.pem" -subj "/C=us/CN=localhost.local"


openssl req -new -x509 -nodes -sha256 -days 390 -newkey rsa:2048 -keyout "RootCA.key" -out "RootCA.pem" -subj "/C=us/CN=localhost.local"
openssl x509 -outform pem -in "RootCA.pem" -out "RootCA.crt"




# Create options file:
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
DNS.2 = *.mixable.blog.local
DNS.3 = mixable.blog.local



# If we want our certificate signed by a CA, we need a certificate signing request (CSR). The CSR includes the public key and some additional information (such as organization and country).
# Let's create a CSR (domain.csr) from our existing private key:
openssl req -key domain.key -new -out domain.csr

# If we want to self sign, e can create a self-signed certificate with just a private key since we can provide the additional CSR information right on the prompt;
openssl req -new -x509 -key server.key -out server.cert -days 365

openssl req -new -x509 -key ~/.localhost-ssl/localhost.key -out ~/.localhost-ssl/localhost.crt -days 3650 -subj /CN=localhost


# We can also create both the private key and CSR with a single command:
openssl req -newkey rsa:2048 -keyout domain.key -out domain.csr

# If we want our private key unencrypted, we can add the -nodes option:
openssl req -newkey rsa:2048 -nodes -keyout domain.key -out domain.csr

# Let's create a self-signed certificate (domain.crt) with our existing private key and CSR:
# The -days option specifies the number of days that the certificate will be valid.
openssl x509 -signkey domain.key -in domain.csr -req -days 365 -out domain.crt

# create cert:
openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=de/ST=State/L=City/O=Organization/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile vhosts_domains.ext -out localhost.crt

# This command will create a temporary CSR. We still have the CSR information prompt, of course.
# We can even create a private key and a self-signed certificate with just a single command:
openssl req -newkey rsa:2048 -keyout domain.key -x509 -days 365 -out domain.crt



-------------------
security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/.localhost-ssl/localhost.crt



We'll enter our private key password and some CSR information to complete the process. The output will look like:

Enter pass phrase for domain.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:AU
State or Province Name (full name) [Some-State]:stateA                        
Locality Name (eg, city) []:cityA
Organization Name (eg, company) [Internet Widgits Pty Ltd]:companyA
Organizational Unit Name (eg, section) []:sectionA
Common Name (e.g. server FQDN or YOUR name) []:domain
Email Address []:email@email.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:













