import 'package:flutter/material.dart';
import 'package:kot/Model/Employee_Model.dart';
import 'package:kot/Services/constant.dart';

class EmployeeCard extends StatefulWidget {
  final Employee employee;
  final VoidCallback? onLocationTap;
  final bool isSelected;
  final ValueChanged<bool?>? onCheckboxChanged;

  const EmployeeCard({
    Key? key,
    required this.employee,
    this.onLocationTap,
    this.isSelected = false,
    this.onCheckboxChanged,
  }) : super(key: key);

  @override
  _EmployeeCardState createState() => _EmployeeCardState();
}

class _EmployeeCardState extends State<EmployeeCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  bool _isSwipedOut = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _slideAnimation = Tween<Offset>(
      begin: Offset.zero,
      end: const Offset(-0.7, 0),
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

  void _handleSwipeLeft() {
    if (!_isSwipedOut) {
      _animationController.forward();
      setState(() {
        _isSwipedOut = true;
      });
    }
  }

  void _handleSwipeRight() {
    if (_isSwipedOut) {
      _animationController.reverse();
      setState(() {
        _isSwipedOut = false;
      });
    }
  }

  void _handleLocationTap() {
    widget.onLocationTap?.call();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final bool isSmallScreen = screenWidth < 380;
    final bool isMediumScreen = screenWidth < 600;

    // Responsive padding and sizing
    final double cardMarginH = isSmallScreen ? 8 : (isMediumScreen ? 12 : 16);
    final double cardMarginV = isSmallScreen ? 4 : 6;
    final double cardPadding = isSmallScreen ? 10 : (isMediumScreen ? 14 : 16);
    final double avatarRadius = isSmallScreen ? 22 : (isMediumScreen ? 26 : 30);
    final double spacing = isSmallScreen ? 8 : (isMediumScreen ? 12 : 16);

    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          margin: EdgeInsets.symmetric(
            horizontal: cardMarginH,
            vertical: cardMarginV,
          ),
          child: Stack(
            children: [
              // Background location button - WITH baseblue BACKGROUND
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    color: baseblue, // Solid baseblue background
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: _handleLocationTap,
                        child: Container(
                          // Remove padding and background decoration
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              // Icon above text
                              Icon(
                                Icons.location_on,
                                color: Colors.white, // White icon
                                size: isSmallScreen ? 24 : 28,
                              ),
                              SizedBox(height: isSmallScreen ? 4 : 6),
                              Text(
                                'Location',
                                style: TextStyle(
                                  color: Colors.white, // White text
                                  fontSize: isSmallScreen ? 12 : 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Main card with gesture detection
              GestureDetector(
                onHorizontalDragEnd: (details) {
                  if (details.primaryVelocity != null) {
                    if (details.primaryVelocity! < -500) {
                      _handleSwipeLeft();
                    } else if (details.primaryVelocity! > 500) {
                      _handleSwipeRight();
                    }
                  }
                },
                child: SlideTransition(
                  position: _slideAnimation,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          spreadRadius: 0,
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(cardPadding),
                      child: Column(
                        children: [
                          // Checkbox row at the top
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Transform.scale(
                                scale: isSmallScreen ? 0.9 : 1.0,
                                child: Checkbox(
                                  value: widget.isSelected,
                                  onChanged: widget.onCheckboxChanged,
                                  activeColor: baseblue,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          // Main content row
                          Row(
                            children: [
                              // Avatar
                              CircleAvatar(
                                radius: avatarRadius,
                                backgroundColor: baseblue.withOpacity(0.1),
                                backgroundImage: widget
                                        .employee.imageurl.isNotEmpty
                                    ? NetworkImage(
                                        'http://api.amalaplus.org:9090/uploads/${widget.employee.imageurl}')
                                    : null,
                                child: widget.employee.imageurl.isEmpty
                                    ? Text(
                                        widget.employee.employeename.isNotEmpty
                                            ? widget.employee.employeename[0]
                                                .toUpperCase()
                                            : 'E',
                                        style: TextStyle(
                                          color: baseblue,
                                          fontSize: isSmallScreen
                                              ? 16
                                              : (isMediumScreen ? 20 : 24),
                                          fontWeight: FontWeight.bold,
                                        ),
                                      )
                                    : null,
                              ),
                              SizedBox(width: spacing),

                              // Employee Details
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Name and ID
                                    _buildResponsiveRow(
                                      isSmallScreen: isSmallScreen,
                                      mainChild: Text(
                                        widget.employee.employeename,
                                        style: TextStyle(
                                          color: baseblue,
                                          fontSize: isSmallScreen
                                              ? 14
                                              : (isMediumScreen ? 16 : 18),
                                          fontWeight: FontWeight.bold,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                        maxLines: 1,
                                      ),
                                      sideChild: !isSmallScreen
                                          ? Container(
                                              padding: EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 4),
                                              decoration: BoxDecoration(
                                                color:
                                                    baseblue.withOpacity(0.1),
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                              ),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(
                                                    Icons.badge,
                                                    color: baseblue,
                                                    size: 14,
                                                  ),
                                                  SizedBox(width: 4),
                                                  Text(
                                                    widget.employee.employeeid,
                                                    style: TextStyle(
                                                      color: baseblue,
                                                      fontSize: 12,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            )
                                          : null,
                                    ),

                                    // Employee ID for small screens
                                    if (isSmallScreen) ...[
                                      SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.badge,
                                            color: baseblue.withOpacity(0.7),
                                            size: 12,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            widget.employee.employeeid,
                                            style: TextStyle(
                                              color: baseblue.withOpacity(0.7),
                                              fontSize: 10,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],

                                    SizedBox(height: isSmallScreen ? 4 : 6),

                                    // Designation and Status
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            widget.employee.designation,
                                            style: TextStyle(
                                              color: baseblue.withOpacity(0.8),
                                              fontSize: isSmallScreen
                                                  ? 11
                                                  : (isMediumScreen ? 13 : 14),
                                              fontWeight: FontWeight.w500,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                            maxLines: 1,
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: isSmallScreen ? 4 : 6,
                                              vertical: 2),
                                          decoration: BoxDecoration(
                                            color: _getStatusColor(
                                                widget.employee.statuscolor),
                                            borderRadius:
                                                BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            widget.employee.status,
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: isSmallScreen ? 8 : 10,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: isSmallScreen ? 4 : 6),

                                    // Department and Location
                                    _buildInfoRow(
                                      Icons.business,
                                      widget.employee.department,
                                      Icons.location_on,
                                      widget.employee.locationname,
                                      isSmallScreen,
                                    ),
                                    SizedBox(height: isSmallScreen ? 4 : 6),

                                    // Gender, Age, Mobile
                                    _buildDetailsSection(
                                        isSmallScreen, isMediumScreen),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildResponsiveRow({
    required bool isSmallScreen,
    required Widget mainChild,
    Widget? sideChild,
  }) {
    return Row(
      children: [
        Expanded(child: mainChild),
        if (sideChild != null) ...[
          SizedBox(width: 8),
          sideChild,
        ],
      ],
    );
  }

  Widget _buildInfoRow(
    IconData icon1,
    String text1,
    IconData icon2,
    String text2,
    bool isSmallScreen,
  ) {
    return Row(
      children: [
        Icon(
          icon1,
          color: baseblue.withOpacity(0.6),
          size: isSmallScreen ? 12 : 14,
        ),
        SizedBox(width: 4),
        Expanded(
          child: Text(
            text1,
            style: TextStyle(
              color: baseblue.withOpacity(0.7),
              fontSize: isSmallScreen ? 10 : 12,
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
        SizedBox(width: 8),
        Icon(
          icon2,
          color: baseblue.withOpacity(0.6),
          size: isSmallScreen ? 12 : 14,
        ),
        SizedBox(width: 4),
        Expanded(
          child: Text(
            text2,
            style: TextStyle(
              color: baseblue.withOpacity(0.7),
              fontSize: isSmallScreen ? 10 : 12,
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailsSection(bool isSmallScreen, bool isMediumScreen) {
    return Column(
      children: [
        // Gender and Age
        Row(
          children: [
            _buildDetailItem(
              widget.employee.gender == 'M' ? Icons.male : Icons.female,
              widget.employee.gender,
              isSmallScreen,
            ),
            SizedBox(width: isSmallScreen ? 8 : 12),
            _buildDetailItem(
              Icons.cake,
              _formatAge(widget.employee.age),
              isSmallScreen,
            ),
            if (!isSmallScreen) ...[
              SizedBox(width: 12),
              Expanded(
                child: _buildDetailItem(
                  Icons.phone,
                  widget.employee.mobile,
                  isSmallScreen,
                ),
              ),
            ],
          ],
        ),
        // Mobile for small screens
        if (isSmallScreen) ...[
          SizedBox(height: 4),
          Row(
            children: [
              _buildDetailItem(
                Icons.phone,
                widget.employee.mobile,
                isSmallScreen,
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildDetailItem(IconData icon, String text, bool isSmallScreen) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          color: baseblue.withOpacity(0.6),
          size: isSmallScreen ? 14 : 16,
        ),
        SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: baseblue.withOpacity(0.7),
            fontSize: isSmallScreen ? 10 : 12,
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(String statusColor) {
    try {
      return Color(int.parse(statusColor.replaceFirst('#', '0xFF')));
    } catch (e) {
      return Colors.green;
    }
  }

  String _formatAge(String age) {
    final match = RegExp(r'(\d+)\s*y').firstMatch(age);
    if (match != null) {
      return '${match.group(1)} y';
    }
    return age;
  }
}
