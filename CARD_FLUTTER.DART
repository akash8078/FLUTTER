import 'package:flutter/material.dart';
import 'package:kot/Model/Employee_Model.dart';
import 'package:kot/Services/constant.dart';

class EmployeeCard extends StatefulWidget {
  final Employee employee;
  final VoidCallback? onLocationTap;
  final bool isSelected;
  final ValueChanged<bool?>? onCheckboxChanged;
  final bool isVerified;
  final bool isPatientIP;
  final String patientType;
  final String? packageName;
  final String? credit;
  final List<String>? diagnosis;
  final String? mobileNo;
  final String? place;

  const EmployeeCard({
    Key? key,
    required this.employee,
    this.onLocationTap,
    this.isSelected = false,
    this.onCheckboxChanged,
    this.isVerified = false,
    this.isPatientIP = false,
    this.patientType = 'OP',
    this.packageName,
    this.credit,
    this.diagnosis,
    this.mobileNo,
    this.place,
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

  void _onSwipeActionTap(String action) {
    // Handle different swipe actions based on React implementation
    switch (action) {
      case 'donor_registration':
        // Navigate to donor registration
        break;
      case 'screening_report':
        // Navigate to screening report
        break;
      case 'donation_details':
        // Navigate to donation details
        break;
      case 'test_results':
        // Navigate to test results
        break;
      case 'donor_id_card':
        // Navigate to donor ID card
        break;
      case 'blood_inventory':
        // Navigate to blood inventory
        break;
      case 'transfusion_records':
        // Navigate to transfusion records
        break;
      case 'hospital_requests':
        // Navigate to hospital requests
        break;
      case 'screening':
        // Navigate to screening
        break;
    }
    
    // Reset swipe state
    _handleSwipeRight();
  }

  void _handleLocationTap() {
    widget.onLocationTap?.call();
  }

  // Helper method to get status text as individual characters
  List<String> _getStatusSpelling(String status) {
    final statusUpper = status.toUpperCase();
    
    // Medical Statuses
    if (statusUpper == 'FIRST VISIT') {
      return ['N', 'e', 'w'];
    } else if (statusUpper == 'RENEWAL') {
      return ['R', 'e', 'n', 'e', 'w', 'a', 'l'];
    } else if (statusUpper == 'CROSS CONSULTATION') {
      return ['C', 'r', 'o', 's', 's', '.', 'C'];
    } else if (statusUpper == 'REVISIT') {
      return ['R', 'e', 'v', 'i', 's', 'i', 't'];
    } else if (statusUpper == 'REGISTRATION') {
      return ['R', 'e', 'g'];
    } else if (statusUpper == 'REFFERED') {
      return ['R', 'e', 'f', 'e', 'r', 'r', 'e', 'd'];
    } else if (statusUpper == 'OPINION VISIT') {
      return ['O', 'p', 'i', 'n', 'i', 'o', 'n', 'V'];
    } else if (statusUpper == 'ROUNDS') {
      return ['R', 'o', 'u', 'n', 'd', 's'];
    } else if (statusUpper == 'DEPARTMENT REGISTRATION') {
      return ['D', 'e', 'p', 't', '.', 'R', 'e', 'g'];
    } else if (statusUpper == 'ADMISSION') {
      return ['A', 'd', 'm', 'i', 's', 's', 'i', 'o', 'n'];
    } else if (statusUpper == 'MLC') {
      return ['M', 'L', 'C'];
    } else if (statusUpper == 'BOOKING') {
      return ['A', 'p', 'p', 'o', 'i', 'n', 't', 'm', 'e', 'n', 't'];
    }
    // Blood Bank Statuses
    else if (statusUpper == 'BLED') {
      return ['B', 'l', 'e', 'd'];
    } else if (statusUpper == 'NOTBLED' || statusUpper == 'NOT BLED') {
      return ['N','o','t','B','l','e','d'];
    } else if (statusUpper == 'REJECTED') {
      return ['R', 'e', 'j', 'e', 'c', 't', 'e', 'd'];
    } else if (statusUpper == 'DEFERRED') {
      return ['D', 'e', 'f', 'e', 'r', 'r', 'e', 'd'];
    } else if (statusUpper == 'REGISTERED') {
      return ['R', 'e', 'g', 'i', 's', 't', 'e', 'r', 'e', 'd'];
    } else if (statusUpper == 'SCREENING') {
      return ['S', 'c', 'r', 'e', 'e', 'n', 'i', 'n', 'g'];
    } else if (statusUpper == 'ELIGIBLE') {
      return ['E', 'l', 'i', 'g', 'i', 'b', 'l', 'e'];
    }
    // Default case
    else {
      return ['N', '/', 'A'];
    }
  }

  // Helper method to get status color
  Color _getStatusColor(String status) {
    final statusUpper = status.toUpperCase();
    
    if (statusUpper == "BLED") return const Color(0xFFFF0000); // Red
    if (statusUpper == "NOTBLED" || statusUpper == "NOT BLED") return const Color(0xFF28a745); // Green
    if (statusUpper == "REJECTED") return const Color(0xFFFFA500); // Orange
    
    // Other Medical Status Colors
    if (statusUpper == "FIRST VISIT") return const Color(0xFF094485);
    if (statusUpper == "RENEWAL" || statusUpper == "REVISIT") return const Color(0xFF3b86db);
    if (statusUpper == "MLC") return const Color(0xFFFF0000);
    if (statusUpper == "BOOKED" || statusUpper == "BOOKING") return const Color(0xFF7a1241);
    
    return const Color(0xFF3b86db); // default color
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final bool isSmallScreen = screenWidth < 380;
    final bool isMediumScreen = screenWidth < 600;

    // Responsive padding and sizing
    final double cardMarginH = isSmallScreen ? 8 : (isMediumScreen ? 12 : 16);
    final double cardMarginV = isSmallScreen ? 4 : 6;
    final double avatarRadius = isSmallScreen ? 22 : (isMediumScreen ? 26 : 30);

    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          margin: EdgeInsets.symmetric(
            horizontal: cardMarginH,
            vertical: cardMarginV,
          ),
          child: Stack(
            children: [
              // Left and Right Swipe Actions Background
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      // Left swipe area (Blood Bank actions)
                      Expanded(
                        flex: 50,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildSwipeAction(Icons.person_add, 'Donor Registration', const Color(0xFF33691E), 'donor_registration'),
                              _buildSwipeAction(Icons.assignment, 'Screening Report', const Color(0xFFFF8F00), 'screening_report'),
                              _buildSwipeAction(Icons.local_hospital, 'Donation Details', const Color(0xFF1976D2), 'donation_details'),
                              _buildSwipeAction(Icons.science, 'Test Results', const Color(0xFFC2185B), 'test_results'),
                            ],
                          ),
                        ),
                      ),
                      // Right swipe area (Patient actions)
                      Expanded(
                        flex: 50,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildSwipeAction(Icons.badge, 'Donor ID Card', const Color(0xFF2E7D32), 'donor_id_card'),
                              _buildSwipeAction(Icons.bloodtype, 'Blood Inventory', const Color(0xFFF57F17), 'blood_inventory'),
                              _buildSwipeAction(Icons.medical_services, 'Transfusion Records', const Color(0xFF1565C0), 'transfusion_records'),
                              _buildSwipeAction(Icons.local_hospital, 'Hospital Requests', const Color(0xFFAD1457), 'hospital_requests'),
                              _buildSwipeAction(Icons.description, 'Screening', const Color(0xFF424242), 'screening'),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Main card with gesture detection (React card style)
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
                      color: widget.isVerified 
                        ? const Color(0xFFf5fffa) 
                        : widget.isPatientIP 
                          ? const Color(0xFFfffafa) 
                          : const Color(0xFFf7fbff),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: widget.isVerified ? Colors.green : const Color(0xFF094485),
                        width: 0.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          spreadRadius: 1,
                          blurRadius: 5,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        // Left chevron indicator
                        Container(
                          width: 20,
                          alignment: Alignment.center,
                          child: Icon(
                            Icons.chevron_left,
                            size: 18,
                            color: Colors.grey,
                          ),
                        ),
                        
                        // Left vertical status bar
                        _buildLeftVerticalStatusBar(),
                        
                        // Main content area
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                            child: Row(
                              children: [
                                // Avatar section
                                _buildAvatarSection(avatarRadius, isSmallScreen),
                                
                                const SizedBox(width: 12),
                                
                                // Patient details section
                                Expanded(
                                  child: _buildPatientDetailsSection(isSmallScreen),
                                ),
                                
                                // Right section with details button
                                _buildRightDetailsSection(),
                              ],
                            ),
                          ),
                        ),
                        
                        // Right chevron indicator
                        Container(
                          width: 20,
                          alignment: Alignment.center,
                          child: Icon(
                            Icons.chevron_right,
                            size: 18,
                            color: Colors.grey,
                          ),
                        ),
                        
                        // Right vertical status bar
                        _buildRightVerticalStatusBar(),
                      ],
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

  // Helper method to build swipe action button
  Widget _buildSwipeAction(IconData icon, String text, Color color, [String? action]) {
    return GestureDetector(
      onTap: () {
        if (action != null) {
          _onSwipeActionTap(action);
        }
      },
      child: Container(
        width: 60,
        height: 80,
        margin: const EdgeInsets.symmetric(horizontal: 2),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(5),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              spreadRadius: 1,
              blurRadius: 3,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 4),
            Text(
              text,
              style: TextStyle(
                color: color,
                fontSize: 8,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  // Build left vertical status bar
  Widget _buildLeftVerticalStatusBar() {
    Color statusColor;
    List<String> statusText;
    
    if (widget.isVerified) {
      statusColor = Colors.green;
      statusText = ['V', 'e', 'r', 'i', 'f', 'i', 'e', 'd'];
    } else if (widget.isPatientIP) {
      statusColor = const Color(0xFFea6767);
      statusText = ['R', 'O', 'U', 'N', 'D', 'S'];
    } else {
      statusColor = _getStatusColor(widget.employee.status);
      statusText = _getStatusSpelling(widget.employee.status);
    }
    
    return Container(
      width: 12,
      decoration: BoxDecoration(
        color: statusColor,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: statusText.map((char) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 1),
          child: Text(
            char,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 6,
              fontWeight: FontWeight.bold,
              height: 1.0,
            ),
            textAlign: TextAlign.center,
          ),
        )).toList(),
      ),
    );
  }

  // Build avatar section
  Widget _buildAvatarSection(double avatarRadius, bool isSmallScreen) {
    return Column(
      children: [
        GestureDetector(
          onTap: () {
            // Navigate to patient chart or profile
          },
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(1000),
              border: Border.all(
                color: widget.isVerified 
                  ? Colors.green 
                  : widget.isPatientIP 
                    ? const Color(0xFFea6767) 
                    : const Color(0xFF040d16),
                width: 1,
              ),
            ),
            child: CircleAvatar(
              radius: avatarRadius,
              backgroundColor: baseblue.withOpacity(0.1),
              backgroundImage: widget.employee.imageurl.isNotEmpty
                ? NetworkImage(
                    'http://api.amalaplus.org:9090/uploads/${widget.employee.imageurl}')
                : null,
              child: widget.employee.imageurl.isEmpty
                ? Icon(
                    widget.employee.gender == 'M' ? Icons.male : Icons.female,
                    color: baseblue,
                    size: avatarRadius * 0.8,
                  )
                : null,
            ),
          ),
        ),
        const SizedBox(height: 4),
        // Patient number
        Text(
          widget.employee.employeeid,
          style: TextStyle(
            fontSize: isSmallScreen ? 10 : 11,
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 2),
        // View Profile text
        GestureDetector(
          onTap: () {
            // Navigate to registration details
          },
          child: Text(
            'View Profile',
            style: TextStyle(
              fontSize: isSmallScreen ? 8 : 9,
              color: Colors.black,
            ),
          ),
        ),
      ],
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

  // Build patient details section (React style)
  Widget _buildPatientDetailsSection(bool isSmallScreen) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Patient name row
        Row(
          children: [
            Expanded(
              child: Text(
                widget.employee.employeename,
                style: TextStyle(
                  color: baseblue,
                  fontSize: isSmallScreen ? 14 : 16,
                  fontWeight: FontWeight.bold,
                ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 4),
        
        // Age and Gender in column format (React style)
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Age: ${widget.employee.age}',
              style: TextStyle(
                fontSize: isSmallScreen ? 10 : 11,
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Gender: ${widget.employee.gender}',
              style: TextStyle(
                fontSize: isSmallScreen ? 10 : 11,
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 6),
        
        // Package and Credit badges row
        Row(
          children: [
            // Package badge
            if (widget.packageName != null && widget.packageName!.isNotEmpty)
              Expanded(
                flex: 35,
                child: Container(
                  height: 20,
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFd7ffc9),
                    borderRadius: BorderRadius.circular(5),
                    border: Border.all(color: Colors.grey.withOpacity(0.3)),
                    boxShadow: [
                      BoxShadow(
                        color: baseblue.withOpacity(0.2),
                        spreadRadius: 1,
                        blurRadius: 2,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.local_offer,
                        color: baseblue,
                        size: 10,
                      ),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          widget.packageName!,
                          style: TextStyle(
                            fontSize: isSmallScreen ? 9 : 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              const Expanded(flex: 35, child: SizedBox()),
            
            const SizedBox(width: 8),
            
            // Credit badge
            if (widget.credit != null && widget.credit!.isNotEmpty)
              Expanded(
                flex: 30,
                child: Container(
                  height: 20,
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFfca7a7),
                    borderRadius: BorderRadius.circular(5),
                    boxShadow: [
                      BoxShadow(
                        color: baseblue.withOpacity(0.2),
                        spreadRadius: 1,
                        blurRadius: 2,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.attach_money,
                        color: baseblue,
                        size: 10,
                      ),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          widget.credit!,
                          style: TextStyle(
                            fontSize: isSmallScreen ? 9 : 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              const Expanded(flex: 30, child: SizedBox()),
          ],
        ),
        
        // Diagnosis section (if available)
        if (widget.diagnosis != null && widget.diagnosis!.isNotEmpty) ..[
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            child: Text(
              widget.diagnosis!.join(', '),
              style: TextStyle(
                fontSize: isSmallScreen ? 10 : 12,
                fontStyle: FontStyle.italic,
                color: baseblue,
              ),
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),
        ],
        
        // Mobile and location row
        if (widget.mobileNo != null && widget.mobileNo!.isNotEmpty) ..[
          const SizedBox(height: 4),
          Row(
            children: [
              Icon(
                Icons.phone,
                color: baseblue,
                size: 10,
              ),
              const SizedBox(width: 4),
              Text(
                widget.mobileNo!,
                style: TextStyle(
                  fontSize: isSmallScreen ? 10 : 11,
                  color: Colors.black,
                ),
              ),
              if (widget.place != null && widget.place!.isNotEmpty) ..[
                const SizedBox(width: 8),
                Icon(
                  Icons.home,
                  color: baseblue,
                  size: 10,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    widget.place!,
                    style: TextStyle(
                      fontSize: isSmallScreen ? 10 : 11,
                      color: Colors.black,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ],
          ),
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

  // Build right details section (React style)
  Widget _buildRightDetailsSection() {
    return Column(
      children: [
        // Triangle pointing up (when details are expanded)
        // if (detailsExpanded)
        //   CustomPaint(
        //     painter: TrianglePainter(color: baseblue),
        //     size: const Size(30, 10),
        //   ),
        
        // DETAILS vertical text button
        GestureDetector(
          onTap: () {
            // Handle details toggle
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            decoration: BoxDecoration(
              color: baseblue,
              boxShadow: [
                BoxShadow(
                  color: baseblue.withOpacity(0.3),
                  spreadRadius: 1,
                  blurRadius: 3,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: ['D', 'E', 'T', 'A', 'I', 'L', 'S'].map((char) => 
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 1),
                  child: Text(
                    char,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 6,
                      fontWeight: FontWeight.bold,
                      height: 1.0,
                    ),
                    textAlign: TextAlign.center,
                  ),
                )
              ).toList(),
            ),
          ),
        ),
        
        // Triangle pointing down (when details are collapsed)
        // if (!detailsExpanded)
        //   CustomPaint(
        //     painter: TrianglePainter(color: baseblue, pointDown: true),
        //     size: const Size(30, 10),
        //   ),
      ],
    );
  }

  // Build right vertical status bar
  Widget _buildRightVerticalStatusBar() {
    Color statusColor;
    List<String> statusText = [' ']; // Default empty space
    
    // Check for booking status or other right-side status
    if (widget.employee.status.toUpperCase() == 'BOOKED' || 
        widget.employee.status.toUpperCase() == 'BOOKING') {
      statusColor = const Color(0xFF7a1241);
      statusText = ['B', 'o', 'o', 'k', 'e', 'd'];
    } else {
      // Different color logic based on patient type
      if (widget.isPatientIP) {
        statusColor = const Color(0xFFea6767);
      } else {
        switch (widget.employee.status.toUpperCase()) {
          case 'FIRST VISIT':
            statusColor = const Color(0xFF094485);
            break;
          case 'RENEWAL':
          case 'REVISIT':
            statusColor = const Color(0xFF3b86db);
            break;
          case 'MLC':
            statusColor = const Color(0xFFFF0000);
            break;
          case 'CROSS CONSULTATION':
            statusColor = const Color(0xFFfca671);
            break;
          case 'BOOKED':
          case 'BOOKING':
            statusColor = const Color(0xFF7a1241);
            break;
          default:
            statusColor = const Color(0xFF3b86db);
        }
      }
    }
    
    return Container(
      width: 8,
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.7),
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: statusText.map((char) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 1),
          child: Text(
            char,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 6,
              fontWeight: FontWeight.bold,
              height: 1.0,
            ),
            textAlign: TextAlign.center,
          ),
        )).toList(),
      ),
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
    // If it's a hex color string, parse it
    if (statusColor.startsWith('#')) {
      try {
        return Color(int.parse(statusColor.replaceFirst('#', '0xFF')));
      } catch (e) {
        return Colors.green;
      }
    }
    
    // Otherwise use status-based colors
    final statusUpper = statusColor.toUpperCase();
    
    if (statusUpper == "BLED") return const Color(0xFFFF0000); // Red
    if (statusUpper == "NOTBLED" || statusUpper == "NOT BLED") return const Color(0xFF28a745); // Green
    if (statusUpper == "REJECTED") return const Color(0xFFFFA500); // Orange
    
    // Other Medical Status Colors
    if (statusUpper == "FIRST VISIT") return const Color(0xFF094485);
    if (statusUpper == "RENEWAL" || statusUpper == "REVISIT") return const Color(0xFF3b86db);
    if (statusUpper == "MLC") return const Color(0xFFFF0000);
    if (statusUpper == "BOOKED" || statusUpper == "BOOKING") return const Color(0xFF7a1241);
    
    return const Color(0xFF3b86db); // default color
  }

  String _formatAge(String age) {
    final match = RegExp(r'(\d+)\s*y').firstMatch(age);
    if (match != null) {
      return '${match.group(1)} y';
    }
    return age;
  }
}
