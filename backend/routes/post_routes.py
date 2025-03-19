from flask import Blueprint, request, jsonify
from models import db, Post
from utils.validators import PostSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid  # Import for generating unique IDs

post_bp = Blueprint('posts', __name__)
post_schema = PostSchema()

@post_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    page = request.args.get('page', 1, type=int)  # Default to page 1
    limit = request.args.get('limit', 10, type=int)  # Default limit = 10

    paginated_posts = Post.query.paginate(page=page, per_page=limit, error_out=False)
    
    posts_data = [
        {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'user_id': post.user_id
        } for post in paginated_posts.items
    ]

    return jsonify({
        'total_posts': paginated_posts.total,
        'current_page': page,
        'total_pages': paginated_posts.pages,
        'posts': posts_data
    }), 200

@post_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    errors = post_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    new_post = Post(
        id=str(uuid.uuid4()),  # Generate a unique string ID
        title=data['title'],
        content=data['content'],
        user_id=get_jwt_identity()  # No need to convert to integer
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'message': 'Post created successfully'}), 201

@post_bp.route('/posts/<string:id>', methods=['PUT'])  # Change <int:id> to <string:id>
@jwt_required()
def update_post(id):
    post = Post.query.get_or_404(id)
    current_user_id = get_jwt_identity()  # No need to convert to integer
    if post.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()
    return jsonify({'message': 'Post updated successfully'})

@post_bp.route('/posts/<string:id>', methods=['DELETE'])  # Change <int:id> to <string:id>
@jwt_required()
def delete_post(id):
    post = Post.query.get_or_404(id)
    current_user_id = get_jwt_identity()  # No need to convert to integer
    if post.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully'})