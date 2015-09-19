# errorcode
Translate error messages to errorcodes.

## API Reference
Function to add status field to an error to be used with express.

<a name="module_errorcode..add"></a>
### ~~errorcode~add(status, error) ⇒ <code>Error</code>~~
***Deprecated***

Add the status to an error.

**Kind**: inner method of <code>[errorcode](#module_errorcode)</code>  
**Returns**: <code>Error</code> - error with the status.  
**Throws**:

- Error when missing any argument.


| Param | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | http status code. |
| error | <code>Error</code> | the error which the status will be appended. |

<a name="module_errorcode..register"></a>
### errorcode~register(object)
Adds the current object to the dictionary

**Kind**: inner method of <code>[errorcode](#module_errorcode)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | mapping a message to an errorcode |

<a name="module_errorcode..get"></a>
### errorcode~get(error)
Gets the error code for the first word of the error message or 500

**Kind**: inner method of <code>[errorcode](#module_errorcode)</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>object</code> | with message |



* * *