import 'package:flutter/material.dart';

class CardFlutter extends StatefulWidget {
  final String title;
  final String? subtitle;
  final String content;
  final String? imageUrl;
  final String? buttonText;
  final VoidCallback? onButtonPressed;

  const CardFlutter({
    super.key,
    required this.title,
    this.subtitle,
    required this.content,
    this.imageUrl,
    this.buttonText,
    this.onButtonPressed,
  });

  @override
  State<CardFlutter> createState() => _CardFlutterState();
}

class _CardFlutterState extends State<CardFlutter>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _elevationAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.98,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    _elevationAnimation = Tween<double>(
      begin: 4.0,
      end: 12.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 320),
      margin: const EdgeInsets.all(16),
      child: MouseRegion(
        onEnter: (_) => _animationController.forward(),
        onExit: (_) => _animationController.reverse(),
        child: AnimatedBuilder(
          animation: _animationController,
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value,
              child: Card(
                elevation: _elevationAnimation.value,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: const Color(0xFFE2E8F0),
                    width: 1,
                  ),
                ),
                color: Colors.white,
                shadowColor: Colors.black.withOpacity(0.1),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Card Header with Image
                      if (widget.imageUrl != null) _buildCardImage(),
                      
                      // Card Body
                      _buildCardBody(),
                      
                      // Card Footer
                      if (widget.buttonText != null) _buildCardFooter(),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildCardImage() {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        image: DecorationImage(
          image: NetworkImage(widget.imageUrl!),
          fit: BoxFit.cover,
        ),
      ),
    );
  }

  Widget _buildCardBody() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            widget.title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1A202C),
              height: 1.3,
            ),
          ),
          
          // Subtitle
          if (widget.subtitle != null) ...[
            const SizedBox(height: 8),
            Text(
              widget.subtitle!,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF718096),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
          
          const SizedBox(height: 12),
          
          // Content
          Text(
            widget.content,
            style: const TextStyle(
              fontSize: 16,
              color: Color(0xFF4A5568),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardFooter() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
      decoration: const BoxDecoration(
        color: Color(0xFFF7FAFC),
        border: Border(
          top: BorderSide(
            color: Color(0xFFE2E8F0),
            width: 1,
          ),
        ),
      ),
      child: _buildGradientButton(),
    );
  }

  Widget _buildGradientButton() {
    return Container(
      width: double.infinity,
      height: 44,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF667EEA), // #667eea
            Color(0xFF764BA2), // #764ba2
          ],
        ),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF667EEA).withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(8),
          onTap: widget.onButtonPressed,
          child: Center(
            child: Text(
              widget.buttonText!,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Example usage widget
class CardFlutterExample extends StatelessWidget {
  const CardFlutterExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text('Flutter Card Example'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 1,
      ),
      body: const Center(
        child: CardFlutter(
          title: 'Beautiful Flutter Card',
          subtitle: 'Styled like React component',
          content: 'This Flutter card has been styled to match the modern design patterns from the React component, including hover effects, shadows, and gradient buttons.',
          imageUrl: 'https://via.placeholder.com/320x200',
          buttonText: 'Get Started',
        ),
      ),
    );
  }
}