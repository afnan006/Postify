from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class PostSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(max=255))
    content = fields.Str(required=True)
