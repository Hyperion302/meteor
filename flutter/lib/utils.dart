String formatTimestamp(int timestamp) {
    Duration age = Duration(milliseconds: DateTime.now().millisecondsSinceEpoch - timestamp*1000);
    // Less than an hour, minutes
    if(age < Duration(hours: 1)) {
      return '${age.inMinutes} minute${age.inMinutes != 1 ? 's' : ''} ago';
    }
    // Less than a day, hours
    if(age < Duration(days: 1)) {
      return '${age.inHours} hour${age.inHours != 1 ? 's' : ''} ago';
    }
    // less than a week, days
    if(age < Duration(days: 7)) {
      return '${age.inDays} day${age.inDays != 1 ? 's' : ''} ago';
    }
    // Less than a month, weeks
    if(age < Duration(days: 31)) {
      // Get days
      int days = age.inDays;
      return '${days ~/ 7} week${days ~/ 7 != 1 ? 's' : ''} ago';
    }
    // Less than a year, months
    if(age < Duration(days: 365)) {
      int days = age.inDays;
      return '${days ~/ 31} month${days ~/ 31 != 1 ? 's' : ''} ago';
    }
    // Years
    int days = age.inDays;
    return '${days ~/ 365} years${days ~/ 365 != 1 ? 's' : ''} ago';
  }