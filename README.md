# errorcode
Adds status to an error

## API Reference
Function to add status field to an error to be used with express.

<a name="module_errorcode..errorcode"></a>
### errorcode~errorcode(status, error) ⇒ <code>Error</code>
Appends the status to an error.

**Kind**: inner method of <code>[errorcode](#module_errorcode)</code>  
**Returns**: <code>Error</code> - error with the status.  
**Throws**:

- Error when missing any argument.


| Param | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | http status code. |
| error | <code>Error</code> | the error which the status will be appended. |



* * *