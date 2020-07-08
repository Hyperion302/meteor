String formatTimestamp(int timestamp) {
  // Less than a minute, seconds
  if (timestamp < 60) {
    return '$timestamp second${timestamp != 1 ? 's' : ''}';
  }
  // Less than an hour, minutes
  if (timestamp < 3600) {
    int minutes = timestamp ~/ 60;
    return '$minutes minute${minutes != 1 ? 's' : ''}';
  }
  // Less than a day, hours
  if (timestamp < 86400) {
    int hours = timestamp ~/ 3600;
    return '$hours hour${hours != 1 ? 's' : ''}';
  }
  // less than a week, days
  if (timestamp < 604800) {
    int days = timestamp ~/ 86400;
    return '$days day${days != 1 ? 's' : ''}';
  }
  // Less than a month, weeks
  if (timestamp < 2419200) {
    int weeks = timestamp ~/ 604800;
    return '$weeks week${weeks != 1 ? 's' : ''}';
  }
  // Less than a year, months
  if (timestamp < 29030400) {
    int months = timestamp ~/ 2419200;
    return '$months month${months != 1 ? 's' : ''}';
  }
  // Years
  int years = timestamp ~/ 29030400;
  return '$years year${years != 1 ? 's' : ''}';
}

String formatAge(int agestamp) {
  return formatTimestamp(Duration(milliseconds: DateTime.now().millisecondsSinceEpoch - agestamp * 1000).inSeconds) + ' ago';
}

String formatEVC(int watchtime, double duration) {
  var evc = (watchtime / duration).round();
  // Less than 1000, just return
  if (evc < 1000) {
    return '$evc view${evc != 1 ? 's' : ''}';
  }
  // Less than 10000, add K and 1 decimal place
  if (evc < 10000) {
    double scaledEvc = evc / 1000;
    return '${scaledEvc.toStringAsFixed(1)}K views';
  }
  // Less than 1000000, add K and round to whole unit
  if (evc < 1000000) {
    int scaledEvc = evc ~/ 1000;
    return '${scaledEvc}K views';
  }
  // Less than 10000000, add M and 1 decimal place
  if (evc < 10000000) {
    double scaledEvc = evc / 1000000;
    return '${scaledEvc.toStringAsFixed(1)}M views';
  }
  // Less than 1000000000, add M and round to whole unit
  if(evc < 1000000000) {
    int scaledEvc = evc ~/ 1000000;
    return '${scaledEvc}M views';
  }
  // For now this is where it stops
  return '';
}

String getChannelIconURL(String channel, String sizeClass) {
  return 'https://storage.googleapis.com/prod-swish/channelIcons/${channel}_$sizeClass.png';
}
