package com.smartfarmsystem.server.farm;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class FarmRequestDto {

    private String name;
    private String address;
    private String detailedAddress;
    private String description;

    private List<DeviceRequestDto> devices;

}
