from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer) :
    # show the reviewer's name and email - not editable
    reviewer_name = serializers.CharField(source='user.username', read_only=True)
    reviewer_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta :
        model = Review
        fields = [
            'id',
            'product',
            'reviewer_name',
            'reviewer_email',
            'rating',
            'comment',
            'created_at',
        ]
        # these are set automatically - user cannot set them
        read_only_fields = ['id', 'created_at', 'reviewer_name', 'reviewer_email']
        
    def validate_rating(self, value) :
        # extra check on top of model validator
        if not ( 1 <= value <= 5 ) :
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
    
    def validate(self, data) :
        # check if the user has already reviewed this product
        request = self.context.get('request')
        product = data.get('product')
        
        if request and product :
            if Review.objects.filter(product=product, user=request.user).exists() :
                raise serializers.ValidationError("You have already reviewed this product.")
            
        return data