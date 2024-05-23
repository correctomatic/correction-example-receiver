# Example of corrections receiver

It provides an enpoint `/log` to receive corrections from the Correctomatic Systems. It will
save the corrections to files in the `UPLOAD_DIR` directory and show them in the
console.

Start the receiver with `yarn start`

You can configure the port and the upload directory by setting the environment variables
or by creating a `.env` file in the root of the project.

With `LOG_LEVEL=warn` you will see only the corrections in the console.
