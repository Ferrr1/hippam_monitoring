<?php


use Illuminate\Support\Facades\Schedule;

Schedule::command('check:inactive-devices')->everyMinute()->withoutOverlapping();
